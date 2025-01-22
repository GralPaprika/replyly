INSERT INTO
    public.regions (id, NAME, deleted)
VALUES
    ('7349bf1f-bf12-412d-a6fc-47533d950a5b', 'Mexico', FALSE);

INSERT INTO
    public.plans (
    id,
    NAME,
    description,
    price,
    messages_limit,
    region_id,
    created_at,
    deleted
)
VALUES
    (
        '3131a73c-6807-494f-91f4-b32fdafa9e22',
        'basic',
        'Basic plan description',
        10.00,
        100,
        '7349bf1f-bf12-412d-a6fc-47533d950a5b', -- Mexico region ID
        NOW(),
        FALSE
    ),
    (
        'e32866bf-1789-4be8-b6ed-744532f54a7b',
        'enhanced',
        'Enhanced plan description',
        20.00,
        200,
        '7349bf1f-bf12-412d-a6fc-47533d950a5b', -- Mexico region ID
        NOW(),
        FALSE
    ),
    (
        '864f78a8-4844-4d1d-962e-c666a5bf6957',
        'pro',
        'Pro plan description',
        30.00,
        300,
        '7349bf1f-bf12-412d-a6fc-47533d950a5b', -- Mexico region ID
        NOW(),
        FALSE
    ),
    (
        'b18a6c28-945c-42bf-b703-6c2b7bd59f62',
        'unlimited',
        'Unlimited plan description',
        40.00,
        1000,
        '7349bf1f-bf12-412d-a6fc-47533d950a5b', -- Mexico region ID
        NOW(),
        FALSE
    );

INSERT INTO
    public.network (id, NAME, deleted)
VALUES
    ('a31aebaf-9abf-4150-a5ac-8e0f247e77c9', 'whatsapp', FALSE);

INSERT INTO
    public.businesses (
    id,
    business_name,
    email,
    stripe_id,
    first_name,
    last_name,
    second_last_name,
    display_name,
    created_at,
    deleted
)
VALUES
    (
        'b7e82f32-af70-48ad-b355-c97629b4afdb',
        'Acme Corporation',
        'contact@acmecorp.com',
        'acct_123456789',
        'John',
        'Doe',
        'Smith',
        'Acme Corp',
        NOW(),
        FALSE
    );

INSERT INTO public.business_plan (id, business_id, plan_id, start_date, end_date, active, plan_limit, usage)
VALUES
    (
        'cabb92d2-9da7-4e4b-a984-c611f309d8e6',
        'b7e82f32-af70-48ad-b355-c97629b4afdb', -- Acme Corporation's business ID
        '3131a73c-6807-494f-91f4-b32fdafa9e22', -- Basic plan ID
        now(),
        now() + interval '1 month',
        true,
        100,
        0
    );

-- Insert WhatsApp into all available plans
INSERT INTO
    public.networks_per_plan (id, network_id, plan_id)
VALUES
    (
        '85e0b244-08bb-4f13-b0c9-c328dfa096c7',
        'a31aebaf-9abf-4150-a5ac-8e0f247e77c9', -- whatsapp network ID
        '3131a73c-6807-494f-91f4-b32fdafa9e22' -- basic plan ID
    ),
    (
        '8384dfd7-4127-49fa-ae00-feb12f990e30',
        'a31aebaf-9abf-4150-a5ac-8e0f247e77c9', -- whatsapp network ID
        'e32866bf-1789-4be8-b6ed-744532f54a7b' -- enhanced plan ID
    ),
    (
        '203e3d00-f897-4d94-9242-29c7bce4e7fa',
        'a31aebaf-9abf-4150-a5ac-8e0f247e77c9', -- whatsapp network ID
        '864f78a8-4844-4d1d-962e-c666a5bf6957' -- pro plan ID
    ),
    (
        'b4854cc8-e231-4422-9a25-32bac30419cf',
        'a31aebaf-9abf-4150-a5ac-8e0f247e77c9', -- whatsapp network ID
        'b18a6c28-945c-42bf-b703-6c2b7bd59f62' -- unlimited plan ID
    );

-- Insert a user for Acme Corporation with the name Acme Admin and role of business admin
INSERT INTO
    public.users (
    id,
    NAME,
    username,
    PASSWORD,
    email,
    role_id,
    business_id,
    deleted
)
VALUES
    (
        'cf3637c2-35d1-4761-8bda-c7c3304764be',
        'Acme Admin',
        'acmeadmin',
        'securepassword',
        'acme.admin@acmecorp.com',
        1, -- business admin
        'b7e82f32-af70-48ad-b355-c97629b4afdb', -- business
        FALSE
    );

-- Business location for Acme Corporation
INSERT INTO
    public.business_locations (id, name, business_id, is_global, created_at, deleted)
VALUES
    (
        '26dbb056-75a2-48a5-a8b3-46f708221c5c',
        'ACME Corporation',
        'b7e82f32-af70-48ad-b355-c97629b4afdb', -- business_id
        TRUE,
        NOW(),
        FALSE
    );

-- Insert a schedule for the location created for Acme Admin
INSERT INTO
    public.schedules (id, business_location_id, schedule, deleted)
VALUES
    (
        '4ddde752-6860-4012-808f-f79b33df837b',
        '26dbb056-75a2-48a5-a8b3-46f708221c5c', -- location id
        '{
          "monday": {
            "startTime": "09:00",
            "breakStart": "14:00",
            "breakEnd": "15:00",
            "endTime": "18:00"
          },
          "tuesday": {
            "startTime": "09:00",
            "breakStart": "14:00",
            "breakEnd": "15:00",
            "endTime": "18:00"
          },
          "wednesday": {
            "startTime": "09:00",
            "breakStart": "14:00",
            "breakEnd": "15:00",
            "endTime": "18:00"
          },
          "thursday": {
            "startTime": "09:00",
            "breakStart": "14:00",
            "breakEnd": "15:00",
            "endTime": "18:00"
          },
          "friday": {
            "startTime": "09:00",
            "breakStart": "14:00",
            "breakEnd": "15:00",
            "endTime": "18:00"
          },
          "saturday": {
            "startTime": "09:00",
            "endTime": "14:00"
          }
        }',
        FALSE
    );

-- Insert WhatsApp network for Acme Corporation
INSERT INTO
    public.networks_per_business (id, network_id, business_id, deleted)
VALUES
    (
        gen_random_uuid (),
        'a31aebaf-9abf-4150-a5ac-8e0f247e77c9', -- WhatsApp network ID
        'b7e82f32-af70-48ad-b355-c97629b4afdb', -- Acme Corporation's business ID
        FALSE
    );

-- Insert WhatsApp entry using the existing business location
INSERT INTO
    public.whatsapp(
        id,
        business_location_id,
        phone_number,
        token,
        session_status,
        created_at,
        deleted
    )
    VALUES
        (
            '3a617457-5d6a-4a0d-9a15-0f466fd5a8b0',
            '26dbb056-75a2-48a5-a8b3-46f708221c5c', -- location id
            '1234567890', -- Replace with the actual phone number
            'JNujdgD1VNDBQPqIG0XL32ZD4mpsg9AO', -- Replace with the actual token
            4, -- AUTH WhatsApp status ID
            NOW(),
            FALSE
        );

INSERT INTO
    public.business_users_locations (
    id,
    business_user_id,
    business_location_id,
    deleted
)
VALUES
    (
        'e0592a66-a543-41e4-88be-6e02b26d3cfd',
        'cf3637c2-35d1-4761-8bda-c7c3304764be', -- business user ID
        '26dbb056-75a2-48a5-a8b3-46f708221c5c', -- business location ID
        FALSE
    );

INSERT INTO
    public.currencies (id, NAME, symbol, code, deleted)
VALUES
    (
        0,
        'Mexican Peso',
        '$',
        'MXN',
        FALSE
    );

INSERT INTO
    public.rate_per_message (
    id,
    rate,
    business_id,
    messages_lower_limit,
    messages_upper_limit,
    deleted,
    currency
)
VALUES
    (
        '48534d32-b6cc-4715-a305-a29a5fb0bcda',
        1.00, -- Rate
        'b7e82f32-af70-48ad-b355-c97629b4afdb', -- Business ID from your script
        0, --Message lower limit
        100, -- Messages upper limit (can be NULL if not specified)
        FALSE, -- Deleted
        0 -- Currency ID
    ),
    (
        'ee144150-9ea8-4152-aa59-9e94e312eb7e',
        2.00, -- Rate
        'b7e82f32-af70-48ad-b355-c97629b4afdb', -- Business ID from your script
        100, -- Messages lower limit
        NULL, -- Messages upper limit (can be NULL if not specified)
        FALSE, -- Deleted
        0 -- Currency ID
    );