import {AppComposition} from "@/composition/AppComposition";
import {SignUpUseCase} from "@/lib/auth/usecases/SignUpUseCase";
import {SignInUseCase} from "@/lib/auth/usecases/SignInUseCase";
import {AuthRepository} from "@/lib/auth/models/AuthRepository";
import {AuthRepositoryImpl} from "@/lib/auth/repositories/AuthRepositoryImpl";
import {BusinessRepository} from "@/lib/business/models/BusinessRepository";
import {BusinessRepositoryImpl} from "@/lib/business/repositories/BusinessRepositoryImpl";
import {CreateBusinessUseCase} from "@/lib/business/usecases/CreateBusinessUseCase";
import {IsValidSignUpDataUseCase} from "@/lib/auth/usecases/IsValidSignUpDataUseCase";
import {businessDataSchema} from "@/lib/auth/models/BusinessData";
import {ValidateFunction} from "ajv";
import {createServerClient, GetAllCookies, SetAllCookies} from "@supabase/ssr";
import {cookies as cookiesRepository} from "next/headers";
import {SupabaseServerClientFactory} from "@/lib/auth/factories/SupabaseServerClientFactory";
import {SupabaseClient} from "@supabase/supabase-js";
import {Middleware, SessionMiddlewareFactory} from "@/lib/auth/factories/SessionMiddlewareFactory";
import {NextRequest, NextResponse} from "next/server";
import {SupabaseCookie} from "@/lib/auth/models/SupabaseCookie";

export class AuthComposition {
  private readonly appCompositionRoot: AppComposition
  private authRepository!: AuthRepository
  private businessRepository!: BusinessRepository
  private businessDataValidator!: ValidateFunction
  private signUpUseCase!: SignUpUseCase
  private signInUseCase!: SignInUseCase
  private createBusinessUseCase!: CreateBusinessUseCase
  private isValidSignUpDataUseCase!: IsValidSignUpDataUseCase


  private constructor(appCompositionRoot: AppComposition) {
    this.appCompositionRoot = appCompositionRoot
  }

  static provideInstance(): AuthComposition {
    return new AuthComposition(AppComposition.getInstance())
  }

  private provideSupabaseClient() {
    return this.appCompositionRoot.getSupabaseClient()
  }

  private provideCookies() {
    return cookiesRepository()
  }

  provideSupabaseServerClientFactory(): SupabaseServerClientFactory {
    return {
      create(getAll: GetAllCookies, setAll: SetAllCookies): SupabaseClient {
        return createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() { return getAll() },
              setAll(cookiesToSet) { setAll(cookiesToSet) },
            }
          }
        )
      }
    }
  }

  private provideAuthRepository() {
    return this.authRepository ??= new AuthRepositoryImpl(
      this.provideSupabaseClient(),
      this.provideCookies(),
      this.provideSupabaseServerClientFactory(),
    )
  }

  provideSessionMiddlewareFactory(): SessionMiddlewareFactory {
    return {
      create(factory: SupabaseServerClientFactory): Middleware {
        return (request: NextRequest): NextResponse => {
          const newResponse = () => NextResponse.next({request: {headers: request.headers}})
          let response = newResponse()

          const getAllCookies = () => {
            return request.cookies.getAll()
          }

          const setAllCookies = (cookiesToSet: SupabaseCookie[]) => {
            response = newResponse()
            cookiesToSet.forEach(
              ({name, value, options}) => {
                request.cookies.set(name, value)
                response.cookies.set(name, value, options)
              }
            )
          }


          const supabaseServerClient = factory.create(getAllCookies, setAllCookies)

          return response
        }
      }
    }
  }

  private provideBusinessRepository() {
    return this.businessRepository ??= new BusinessRepositoryImpl(this.appCompositionRoot.getDatabase())
  }

  private provideCreateBusinessUseCase() {
    return this.createBusinessUseCase ??= new CreateBusinessUseCase(this.provideBusinessRepository())
  }

  private provideBusinessDataValidator() {
    return this.businessDataValidator ??= this.appCompositionRoot.getAjv().compile(businessDataSchema)
  }

  provideIsValidSignUpDataUseCase() {
    return this.isValidSignUpDataUseCase ??= new IsValidSignUpDataUseCase(this.provideBusinessDataValidator())
  }

  provideSignUpUseCase() {
    return this.signUpUseCase ??= new SignUpUseCase(
      this.provideAuthRepository(),
      this.provideCreateBusinessUseCase(),
    )
  }

  provideSignInUseCase() {
    return this.signInUseCase ??= new SignInUseCase(this.provideAuthRepository())
  }
}