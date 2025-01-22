import LinkWhatsappCard from '../cards/WhatsApp/LinkWhatsappCard';
import ContactInfoCard from '../cards/ContactInfo/ContactInfoCard';
import CustomerServiceCard from '../cards/CustomerService/CustomerServiceCard';
import WelcomeMessageCard from '../cards/WelcomeMessage/WelcomeMessageCard';

import ContextManagementCard from '../cards/ContextManagement/ContextManagementCard';
import ActionCard from '../cards/Action/ActionCard';
import NewFlowCard from '../cards/NewFlow/NewFlowCard';

/**
 * @constant
 * @type {Object}
 * @property {typeof CustomerServiceCard} customerService - Card for handling customer service interactions.
 * @property {typeof LinkWhatsappCard} linkWhatsapp - Card for linking to a WhatsApp account.
 * @property {typeof WelcomeMessageCard} welcomeMessage - Card for setting a welcome message.
 * @property {typeof ContactInfoCard} contactInfo - Card for displaying contact information.
 *
 * // Dynamically created cards
 * @property {typeof ContextManagementCard} contextManagementCard - Card for providing business context to bots.
 * @property {typeof ActionCard} actionCard - Card for defining specific actions.
 * @property {typeof NewFlowCard} newFlowCard - Card for creating new conversation flows.
 */
export const nodeTypes = {
  customerService: CustomerServiceCard,
  linkWhatsapp: LinkWhatsappCard,
  welcomeMessage: WelcomeMessageCard,
  contactInfo: ContactInfoCard,

  contextManagementCard: ContextManagementCard,
  actionCard: ActionCard,
  newFlowCard: NewFlowCard,
};

