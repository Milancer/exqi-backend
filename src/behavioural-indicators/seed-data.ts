/**
 * Behavioural Indicators seed data — transcribed from
 * "CBI Behavioural Indicators Download.pdf" (3 categories, 13 competencies,
 * 5 proficiency levels each).
 *
 * Edit this file to update the on-screen content.
 */

export interface SeedLevel {
  level: number;
  level_label: string;
  level_subtitle: string;
  indicators: string[];
}

export interface SeedCompetency {
  category: string;
  competency_name: string;
  description: string;
  sort_order: number;
  levels: SeedLevel[];
}

const ORCHESTRATE = 'Orchestrate Customer Experience';
const PROMOTE = 'Promote Innovation Culture';
const STRATEGIC = 'Strategic Operational Processes';

export const BEHAVIOURAL_INDICATORS_SEED: SeedCompetency[] = [
  // ───────────────────────── Orchestrate Customer Experience ─────────────────────────
  {
    category: ORCHESTRATE,
    competency_name: 'Customer Experience',
    description:
      'Providing service excellence to internal and/or external clients by conducting a unified digital transformation of the customer experience.',
    sort_order: 1,
    levels: [
      {
        level: 1,
        level_label: 'Novice',
        level_subtitle: 'Shows little or no interest in client service',
        indicators: [
          'Shows little or no interest in client needs.',
          'Displays little or no understanding of SITA’s service offerings.',
          'Demonstrates an inability to link client needs to SITA’s service offerings.',
        ],
      },
      {
        level: 2,
        level_label: 'Developing',
        level_subtitle: 'Responds to immediate client needs',
        indicators: [
          'Responds to client needs in a timely, professional, helpful, and courteous manner, regardless of client attitude.',
          'Clearly shows clients that their perspective is valued.',
          'Strives to consistently meet service standards.',
        ],
      },
      {
        level: 3,
        level_label: 'Proficient',
        level_subtitle: 'Maintains client contact',
        indicators: [
          'Follows up with clients during and after delivery of services to ensure that their needs have been met.',
          'Keeps clients up-to-date on the progress of the service they are receiving and changes that affect them.',
          'Ensures service is provided to clients during critical periods.',
          'Puts clients’ issues in order of priority and addresses most pressing concerns.',
          'Suggests basic digitally enhanced customer service solutions.',
          'Assumes accountability for customer experience.',
        ],
      },
      {
        level: 4,
        level_label: 'Highly Proficient',
        level_subtitle: 'Provides added value and seasoned advice',
        indicators: [
          'Looks for ways to add value beyond the client’s immediate requests.',
          'Explores and addresses the unidentified, underlying and long-term needs of the client.',
          'Enhances client service delivery systems and processes using technology/digitally enhanced solutions.',
          'Acts as a seasoned advisor, providing independent opinion on complex client problems and novel initiatives, and assisting with decision-making.',
          'Integrates digitally enhanced solutions into customer service.',
          'Understands ITIL3 and similar frameworks.',
        ],
      },
      {
        level: 5,
        level_label: 'Mastery',
        level_subtitle: 'Ensures continued service excellence',
        indicators: [
          'Strategically and systematically evaluates emerging and longer-term opportunities and threats to meet clients’ needs.',
          'Determines strategic business direction to best meet clients’ evolving needs.',
          'Monitors, evaluates and, as needed, renews the client service model and service standards.',
          'Gets people together to solve customers’ issues.',
          'Able to plan a transition for end-to-end service management.',
          'Integrates business information and technology architecture to offer services.',
        ],
      },
    ],
  },
  {
    category: ORCHESTRATE,
    competency_name: 'Collaboration',
    description:
      'Initiating, developing and maintaining cooperative relationships with individuals and groups within a particular business/industry/region. Relates to relationships with colleagues, customers, suppliers and shareholders.',
    sort_order: 2,
    levels: [
      {
        level: 1,
        level_label: 'Novice',
        level_subtitle: 'Unable to build and maintain network relations',
        indicators: [
          'Tends to over-rely on formal processes and structures.',
          'Has poor understanding of and fails to work within the informal networks and process within or outside the organisation.',
          'Fails to capitalise on opportunities to build relationships or networks that can benefit the organisation.',
        ],
      },
      {
        level: 2,
        level_label: 'Developing',
        level_subtitle:
          'Uses existing contacts and networks for the benefit of the organisation',
        indicators: [
          'Identifies current or past contacts who can provide work-related information or assistance.',
          'Shares contact names and basic contextual information with contacts (e.g. organisation, role, priorities).',
          'Fosters two-way trust in dealing with contacts (e.g. maintains confidentiality regarding sensitive information).',
        ],
      },
      {
        level: 3,
        level_label: 'Proficient',
        level_subtitle: 'Nurtures existing contacts in and outside the organisation',
        indicators: [
          'Makes a conscious effort to build rapport with contacts by identifying and drawing inferences from shared interests.',
          'Actively nurtures existing contacts by pro-actively sharing information and expertise and encouraging contacts to do the same.',
          'Suggests possible collaborative efforts with contacts.',
          'Demonstrates systematic ways of keeping informed, or keeping in touch, through wider networks.',
        ],
      },
      {
        level: 4,
        level_label: 'Highly Proficient',
        level_subtitle: 'Strategically expands network across organisations',
        indicators: [
          'Evaluates current networks for effectiveness, sufficiency and relevance to achieve the organisation’s strategic objectives.',
          'Identifies and creates opportunities to initiate new connections (including partnerships) that will facilitate the achievement of strategic goals.',
          'Actively, continuously and transparently enhances and expands one’s network to meet strategic goals.',
          'Engages senior officials to promote potential areas of mutual, long-term interest.',
          'Balances people and technology, lead with true empathy and inclusivity.',
        ],
      },
      {
        level: 5,
        level_label: 'Mastery',
        level_subtitle: 'Creates networking opportunities for others in the organisation',
        indicators: [
          'Envisions, creates and facilitates connections to develop and enhance partnerships, alliances and networks that advance shared interests.',
          'Identifies the relevant interest groups, networks and groupings, and uses this understanding to get things done in terms of service improvements and service delivery.',
          'Keeps abreast of national developments within the public sector and the industry/region through active involvement in national networks.',
          'Gets people together to solve the organisation’s issues.',
        ],
      },
    ],
  },
  {
    category: ORCHESTRATE,
    competency_name: 'Communicating and Influencing',
    description:
      'Exchanging information and ideas, both verbally and in writing, clearly and concisely, appropriate for the audience to explain, persuade, convince and influence others to achieve the desired outcomes.',
    sort_order: 3,
    levels: [
      {
        level: 1,
        level_label: 'Novice',
        level_subtitle: 'Requires support in communicating, both verbally and in writing',
        indicators: [
          'Fails to share information with stakeholders.',
          'Uses ineffective communication channels to convey information.',
          'Produces poor quality written reports or communiqués.',
        ],
      },
      {
        level: 2,
        level_label: 'Developing',
        level_subtitle: 'Able to communicate appropriately with relevant stakeholders',
        indicators: [
          'Expresses ideas adequately, both verbally and in writing.',
          'Shows understanding of communication tools appropriate for the audience but needs assistance in utilising them.',
          'Assimilates information reasonably well in reports and documents.',
        ],
      },
      {
        level: 3,
        level_label: 'Proficient',
        level_subtitle: 'Speaks and writes with relative ease to influence others',
        indicators: [
          'Adapts communication content and style according to the audience, including managing body language effectively.',
          'Delivers messages in a manner that gains support, commitment and agreement.',
          'Compiles documents on complex matters that are clear, concise and well structured.',
          'Communicates controversial or sensitive messages to stakeholders tactfully.',
          'Listens well and is receptive to communication from others.',
        ],
      },
      {
        level: 4,
        level_label: 'Highly Proficient',
        level_subtitle: 'Communicates at a strategic level',
        indicators: [
          'Communicates high-risk, sensitive matters to all relevant stakeholders.',
          'Develops well defined communication strategy.',
          'Balances political views with organisational needs when communicating differing viewpoints on complex issues.',
          'Steers negotiations around complex issues and arrives at a win/win situation.',
          'Writes comprehensive reports and proposals that are appropriate for the audience.',
        ],
      },
      {
        level: 5,
        level_label: 'Mastery',
        level_subtitle: 'Represents the organisation in convincing and influencing',
        indicators: [
          'Applies seasoned and tactful communication skills to market and represent the organisation on public platforms.',
          'Creates an environment that is conducive to productive communication, both internally and externally.',
          'Writes strategic documents in a highly professional and concise manner.',
          'Writes concise and informative reports or proposals for high-level engagements with stakeholders.',
        ],
      },
    ],
  },
  {
    category: ORCHESTRATE,
    competency_name: 'Honesty, Integrity and Fairness',
    description: 'Demonstrating and supporting ethics and values.',
    sort_order: 4,
    levels: [
      {
        level: 1,
        level_label: 'Novice',
        level_subtitle: 'Displays egocentric attitude in dealing with issues',
        indicators: [
          'Undermines SITA values in pursuit of personal interests.',
          'Behaves in an unethical manner to get their way.',
          'Masks real intentions from others and goes back on agreements.',
          'Acts in a way that causes others to distrust them.',
        ],
      },
      {
        level: 2,
        level_label: 'Developing',
        level_subtitle: 'Demonstrates the organisation’s ethics and values',
        indicators: [
          'Demonstrates understanding of the organisation’s ethics and values (e.g., treats others fairly and respectfully).',
          'Makes decisions/recommendations and acts consistent with the organisation’s ethics and values, even in the absence of popular support.',
          'Takes responsibility for own work, including ownership of problems and issues.',
          'Avoids conflict of interest.',
        ],
      },
      {
        level: 3,
        level_label: 'Proficient',
        level_subtitle: 'Proactively identifies ethical implications',
        indicators: [
          'Seeks to identify and consider different ethical aspects of a situation when making decisions.',
          'Initiates discussion of ethical dimensions of situations.',
          'Identifies and seeks to balance competing values when selecting approaches or recommendations for dealing with a situation.',
          'Chooses an ethical course of action and does the right thing, even in the face of opposition.',
        ],
      },
      {
        level: 4,
        level_label: 'Highly Proficient',
        level_subtitle: 'Promotes the organisation’s ethics and values',
        indicators: [
          'Ensures that others understand the organisation’s ethics and values.',
          'Monitors the work environment, identifying and addressing any ethical issues that could negatively affect staff or stakeholders.',
          'Deals directly and constructively with lapses of integrity (e.g., intervenes to remind others of the need to respect the dignity of others).',
        ],
      },
      {
        level: 5,
        level_label: 'Mastery',
        level_subtitle: 'Sets high ethical standards and leads by example',
        indicators: [
          'Plays a key role in shaping organisational ethics and values by defining, communicating and consistently exemplifying them.',
          'Ensures that standards and safeguards are in place to protect the organisation’s integrity (e.g. professional standards for financial reporting; integrity/security of information systems).',
        ],
      },
    ],
  },

  // ───────────────────────── Promote Innovation Culture ─────────────────────────
  {
    category: PROMOTE,
    competency_name: 'Outcomes driven',
    description:
      'Setting and striving towards outcomes for self and/or others, measuring and communicating performance and taking corrective action without hesitation when not reaching desired results.',
    sort_order: 5,
    levels: [
      {
        level: 1,
        level_label: 'Novice',
        level_subtitle: 'Displays complacency and no real urgency in work-related matters',
        indicators: [
          'Demonstrates complacency or “entitlement”.',
          'Puts little pressure on others (apologetic, unassertive, reticent).',
          'Pressurises with commands, threats and manipulation (causes anxiety).',
          'Does not recognise achievement or provide constructive feedback.',
        ],
      },
      {
        level: 2,
        level_label: 'Developing',
        level_subtitle:
          'Shows awareness of organisational expectations and is willing to do his/her part',
        indicators: [
          'Sets goals for performance in own area and works to achieve results.',
          'Shows understanding of how personal performance impacts on organisational results.',
          'Open to performance feedback and shows willingness to make necessary adjustment to reach desired levels of performance.',
        ],
      },
      {
        level: 3,
        level_label: 'Proficient',
        level_subtitle:
          'Strives to achieve high performance in own area and contribute to broader organisational goals',
        indicators: [
          'Takes ownership and accountability for own role.',
          'Prescribes direction and boundaries through clearly and emphatically defined goals and performance standards.',
          'Pressurises others towards deadlines and performance standards in a constructive manner.',
          'Ensures consistent delivery of high quality products and services.',
        ],
      },
      {
        level: 4,
        level_label: 'Highly Proficient',
        level_subtitle: 'Fosters an environment of high performance and learning',
        indicators: [
          'Inspires others to pursue organisational goals.',
          'Elicits commitment and a sense of shared urgency from others.',
          'Communicates and celebrates achievements of self and others.',
          'Instills a sense of enthusiasm, energising others beyond what they thought they were capable of.',
          'Turns innovative, digital ideas into a reality via a clear plan of action.',
        ],
      },
      {
        level: 5,
        level_label: 'Mastery',
        level_subtitle:
          'Integrates enabling systems and resources and inspires people to high performance',
        indicators: [
          'Demonstrates sensitivity to the sequencing and timing of arguments, eased off pressure/pulled back selectively.',
          'Revitalises known ideas, activities or products by throwing a new light on them or placing them in a new digital context.',
          'Exerts pressure on others to draw more ideas and contingencies from them beyond the necessary.',
        ],
      },
    ],
  },
  {
    category: PROMOTE,
    competency_name: 'Innovation',
    description: 'Generating viable, new approaches and digital solutions.',
    sort_order: 6,
    levels: [
      {
        level: 1,
        level_label: 'Novice',
        level_subtitle: 'Maintains the status quo and holds on to outdated approaches',
        indicators: [
          'Demonstrates little or no interest in changes in the industry.',
          'Fails to adapt new approaches to meet customers’ needs.',
          'Fails to recognise new developments that could add value to service delivery initiatives.',
        ],
      },
      {
        level: 2,
        level_label: 'Developing',
        level_subtitle: 'Open to new approaches that can be used',
        indicators: [
          'Makes effort to understand the needs of customers and uses knowledge of the industry and organisation to add value to customers’ business.',
          'Thinks about problems from a new perspective and is willing to do things differently (digitally).',
          'Constructively questions current practices and processes and challenges conventional approaches.',
        ],
      },
      {
        level: 3,
        level_label: 'Proficient',
        level_subtitle: 'Modifies current approaches',
        indicators: [
          'Displays ability to conduct research that leads to modification of current approach to better meet needs of clients.',
          'Contributes to the development of new/unusual/ground-breaking digital solutions.',
          'Creates new ideas, digital solutions or approaches to ongoing challenges.',
          'Demonstrates industry specific knowledge.',
        ],
      },
      {
        level: 4,
        level_label: 'Highly Proficient',
        level_subtitle: 'Nurtures creativity',
        indicators: [
          'Proactively conducts research into new trends and assesses application to the public sector.',
          'Identifies new digital shifts in the industry and influences customers/partners to adopt these.',
          'Takes positive steps to raise the level of standards and professionalism in the industry and in government.',
        ],
      },
      {
        level: 5,
        level_label: 'Mastery',
        level_subtitle: 'Develops high-impact approaches through research and development',
        indicators: [
          'Creatively and systematically aligns processes, resources and products with the brand of being thought leader in the industry.',
          'Creates new concepts, digital models, innovations or theories that have wide-ranging impacts on a field, policy area or programme, nationally and possibly internationally.',
          'Identifies unique approaches to deal with situations for which no known precedent exists.',
        ],
      },
    ],
  },
  {
    category: PROMOTE,
    competency_name: 'Planning and Organising',
    description:
      'Developing, implementing, evaluating and adjusting plans to reach goals, while ensuring the optimal use of resources.',
    sort_order: 7,
    levels: [
      {
        level: 1,
        level_label: 'Novice',
        level_subtitle: 'Fails to plan and organise own activities',
        indicators: [
          'Undertakes activities without planning them or without adhering to pre-determined standards or procedures.',
          'Does not prioritise work or approach these in an ad-hoc manner.',
          'Does not check the accuracy of own work.',
        ],
      },
      {
        level: 2,
        level_label: 'Developing',
        level_subtitle: 'Plans and organises own activities',
        indicators: [
          'Plans and organises own activities to accomplish pre-determined standards or procedures.',
          'Seeks clarity on priorities as needed.',
          'Monitors the quality and timeliness of own work.',
          'Responsibly uses the resources at one’s immediate disposal.',
        ],
      },
      {
        level: 3,
        level_label: 'Proficient',
        level_subtitle: 'Plans and organises group activities',
        indicators: [
          'Identifies who needs to be involved and when.',
          'Identifies who will do what, and when, taking into account group members’ skills, needs and, if possible, preferences.',
          'Sets timelines and work steps.',
          'Monitors progress and use of resources (people, supplies, money).',
          'Makes needed adjustments to timelines, steps, and resource allocation.',
        ],
      },
      {
        level: 4,
        level_label: 'Highly Proficient',
        level_subtitle: 'Plans and organises multiple, complex activities',
        indicators: [
          'Identifies and prioritises resources across initiatives/programs.',
          'Ensures that activities are not duplicated.',
          'Ensures that systems are in place to make available the information needed to monitor and evaluate progress and use of resources (e.g., financial, non-financial, historical and prospective information).',
          'Ensures coordination, as needed, across related projects.',
          'Works on various projects and navigate innovation and change across projects.',
          'Derives meaning and insight from unstructured information.',
        ],
      },
      {
        level: 5,
        level_label: 'Mastery',
        level_subtitle: 'Plans and organises at a strategic level',
        indicators: [
          'Determines and communicates objectives, priorities and strategies that provide direction for the organisation.',
          'Secures and allocates programme or project resources in line with strategic direction.',
          'Ensures that programmes are monitored to track progress and optimal resource utilisation, and that adjustments are made as needed.',
          'Ensures that outcomes are evaluated.',
        ],
      },
    ],
  },
  {
    category: PROMOTE,
    competency_name: 'Creative Problem Solving',
    description:
      'Ability to identify problems, their root causes, interrelations between problems and find creative solutions to them.',
    sort_order: 8,
    levels: [
      {
        level: 1,
        level_label: 'Novice',
        level_subtitle: 'Struggles to solve problems',
        indicators: [
          'Overwhelmed by problems.',
          'Fails to identify the root causes of problems.',
          'Blindly adheres to rules or procedures when solving problems, without weighing the merits of the situation.',
          'Offers solutions that do not address the root cause of the problem.',
        ],
      },
      {
        level: 2,
        level_label: 'Developing',
        level_subtitle: 'Analyses the situation and solves basic problems',
        indicators: [
          'Follows a logical process to analyse problems and find their root causes.',
          'Identifies the problem based on a limited number of clear and basic factors.',
          'Selects the solution from predefined options, using clear criteria/procedures.',
          'Verifies that the problem has been solved.',
          'Involves others when making complex decisions.',
        ],
      },
      {
        level: 3,
        level_label: 'Proficient',
        level_subtitle: 'Solves standard problems',
        indicators: [
          'Identifies the problem based on a range of factors, most of which are clear.',
          'Uses simple problem-solving techniques to generate solutions, e.g. brainstorming.',
          'Identifies an optimal solution based on weighing the advantages and disadvantages of alternative approaches.',
          'After implementation, evaluates the effectiveness and efficiency of the solution.',
        ],
      },
      {
        level: 4,
        level_label: 'Highly Proficient',
        level_subtitle: 'Solves complex problems',
        indicators: [
          'Identifies the problem based on a broad range of ambiguous factors.',
          'Sees interrelatedness of problems and their impact on the organisation.',
          'Anticipates and takes action to avoid an approaching problem that might interfere with effective service delivery.',
          'Identifies alternative solutions, including some that are not based on precedent.',
          'Monitors impact and evaluates the effectiveness and efficiency of the solution after it has been implemented and makes needed changes for maximum effect.',
          'Leverages analytics and technology to modernize the organisation through creative problem solving.',
        ],
      },
      {
        level: 5,
        level_label: 'Mastery',
        level_subtitle: 'Solves broad, highly complex problems',
        indicators: [
          'Identifies broad-based complex problems, understands their systemic nature and their impact on the organisation and its processes and outputs.',
          'Applies systems thinking and other well-developed problem-solving techniques to resolve highly complex and strategic problems that save the organisation from deep trouble or position it strategically for excellence.',
          'Develops monitoring and evaluation mechanisms to assess the solution’s effectiveness.',
          'Develops policies and procedures to deal with recurring problems.',
        ],
      },
    ],
  },

  // ───────────────────────── Strategic Operational Processes ─────────────────────────
  {
    category: STRATEGIC,
    competency_name: 'Bimodal IT Practice',
    description:
      'The practice of managing two separate, coherent modes of IT delivery in the digital transformation context, one focused on stability and the other on agility.',
    sort_order: 9,
    levels: [
      {
        level: 1,
        level_label: 'Novice',
        level_subtitle:
          'Have elementary understanding of bimodal approach to IT but not able to implement actions',
        indicators: [
          'Has adapted personal development plan to learn the bimodal IT principles, methodologies.',
          'Basic understanding of how traditional legacy systems will be impacted by new age solution development methodologies.',
          'Basic understanding of agile practices.',
          'Basic understanding of digital transformation principles.',
        ],
      },
      {
        level: 2,
        level_label: 'Developing',
        level_subtitle:
          'Adapts personal work goals, actions and methodologies to implement the bimodal IT approach',
        indicators: [
          'Able to understand how to respond to the bimodal IT impacts on own work deliverables.',
          'Proficient in implementing agile solution development.',
          'Provide feedback from the customers to the solution development teams in both bimodal modes.',
        ],
      },
      {
        level: 3,
        level_label: 'Proficient',
        level_subtitle:
          'Able to direct team goals, actions and methodologies to implement the bimodal IT approach',
        indicators: [
          'Able to switch team task focus concurrently between solution delivery modes requiring either stability, accuracy and safety and exploratory, non-linear, agility and speed.',
          'Enables experimentation on both traditional and new age IT solutions development practices using a risk-based perspective.',
          'Able to deploy iterative solution development practices such as DevOps, adaptive sourcing, sense and response capability from the field to solution development teams.',
        ],
      },
      {
        level: 4,
        level_label: 'Highly Proficient',
        level_subtitle:
          'Influences strategic direction to implement organization goals, actions and methodologies to implement the bimodal IT approach',
        indicators: [
          'Enables executives to evaluate competing projects, how projects are funded and changes the executive interpretation of risk.',
          'Adapts and expand capabilities concurrently between the bimodal modes.',
          'Enables and absorb change and disruption in the bimodal modes appropriately through management of culture and governance required to drive successful outcomes.',
        ],
      },
      {
        level: 5,
        level_label: 'Mastery',
        level_subtitle:
          'Shapes the vision and strategies and values of the organization to implement the bimodal IT approach',
        indicators: [
          'Enables enterprise bimodal approach and capabilities.',
          'Strategically directs enterprise business solutions within both the bimodal modes.',
          'Establishes clear and transparent governance principles and the filters to determine the bimodal mode for the business & IT strategies to achieve outcomes.',
        ],
      },
    ],
  },
  {
    category: STRATEGIC,
    competency_name: 'Managing People and Driving Performance',
    description:
      'Ability to create an environment that is enabling and empowering others to contribute successfully to the organisation.',
    sort_order: 10,
    levels: [
      {
        level: 1,
        level_label: 'Novice',
        level_subtitle:
          'Takes little or no initiative to empower self and others to perform and contribute to organisational goals',
        indicators: [
          'Fails to identify and address performance issues.',
          'Challenges people about their performance inappropriately and/or inconsistently.',
          'Places blame and provides no support for failure.',
        ],
      },
      {
        level: 2,
        level_label: 'Developing',
        level_subtitle: 'Empowers self to perform and contribute to organisational goals',
        indicators: [
          'Displays a sense of ownership and displays creativity and proactive behavior.',
          'Takes steps to empower self, through study or participation in stretching projects.',
          'Takes pride in own and the organisation’s accomplishments.',
        ],
      },
      {
        level: 3,
        level_label: 'Proficient',
        level_subtitle: 'Contributes to others’ empowerment to reach organisational goals',
        indicators: [
          'Stretches self and others to achieve goals.',
          'Takes steps to develop self and encourages development of other employees.',
          'Inspires individual creativity and initiative and inspires all to do their best.',
          'Encourages healthy competition inside the organisation.',
          'Reviews peers’ performance and let peers review his/her performance and strives for peer respect.',
          'Encourages creative, learning and lateral thinkers.',
        ],
      },
      {
        level: 4,
        level_label: 'Highly Proficient',
        level_subtitle:
          'Creates an environment where others can flourish and be empowered to perform',
        indicators: [
          'Enforces a consistent responsibility structure with clear roles and accountabilities and incentive structure.',
          'Implements flexible and user-friendly systems throughout the organization.',
          'Balances challenging people with nurturing people.',
          'Creates opportunities for employees to learn and learn from their mistakes or failures.',
          'Demonstrates emotional intelligence to understand different points of view and take them into consideration.',
          'Develops digital skill sets.',
          'Connects media-savvy millennials with senior leaders to discuss the latest tech buzz and practice.',
        ],
      },
      {
        level: 5,
        level_label: 'Mastery',
        level_subtitle:
          'Provides strategic platform to create an empowering and inspiring environment in the organisation',
        indicators: [
          'Develops strategies to empower others.',
          'Helps to unblock obstacles, identifying and securing resources, and taking care of teams and of the individuals within them.',
          'Develops strategy and goals bottom-up using input from people on all organisational levels.',
          'Takes practical steps to unleash the organisation’s energies and collective capabilities to maximise workforce productivity.',
          'Creates conditions to experiment with digitalisation.',
        ],
      },
    ],
  },
  {
    category: STRATEGIC,
    competency_name: 'Decision-making',
    description:
      'Ability to apply own judgement and make bold decisions in the context of varied levels of risk and ambiguity.',
    sort_order: 11,
    levels: [
      {
        level: 1,
        level_label: 'Novice',
        level_subtitle: 'Fails to make important decisions and passes the buck',
        indicators: [
          'Shows reluctance to apply own judgement to reach decisions.',
          'Hardly contributes to decisions and waits for others to make decisions.',
          'Hides behind policies where own judgement is called upon to make decisions.',
        ],
      },
      {
        level: 2,
        level_label: 'Developing',
        level_subtitle: 'Makes decisions within the available guidelines and policies',
        indicators: [
          'Applies explicit guidelines and procedures in making decisions.',
          'Makes straightforward decisions based on adequate information.',
          'Deals with exceptions using clearly specified rules.',
          'Makes decisions involving little or no consequence of error.',
        ],
      },
      {
        level: 3,
        level_label: 'Proficient',
        level_subtitle: 'Makes decisions by interpreting rules',
        indicators: [
          'Applies guidelines and procedures that require some interpretation in dealing with exceptions.',
          'Makes straightforward decisions based on information that is generally adequate.',
          'Makes decisions involving minor consequence of error.',
          'Seeks guidance as needed when the situation is unclear.',
        ],
      },
      {
        level: 4,
        level_label: 'Highly Proficient',
        level_subtitle: 'Makes complex decisions in the face of ambiguity',
        indicators: [
          'Makes complex decisions for which there is no set procedure.',
          'Considers a multiplicity of interrelated factors for which there is incomplete and contradictory information.',
          'Balances competing priorities in reaching decisions.',
          'Considers the benefits and impact of decisions on other areas of the organisation.',
          'Willing to take risks and accountability to manage the impact/results of decisions.',
        ],
      },
      {
        level: 5,
        level_label: 'Mastery',
        level_subtitle: 'Makes high-risk decisions in the face of ambiguity',
        indicators: [
          'Makes high-risk strategic decisions that have significant consequences.',
          'Uses principles, values and sound business sense to make judgement and reach decisions.',
          'Makes decisions in a volatile environment in which the weight given to any factor can change rapidly.',
          'Reaches decisions assuredly and confidently in an environment of public scrutiny.',
        ],
      },
    ],
  },
  {
    category: STRATEGIC,
    competency_name: 'Responding to Change and Pressure',
    description:
      'Is flexible and adapts positively, to sustain performance when the situation changes, workload increases, tensions rise or priorities shift.',
    sort_order: 12,
    levels: [
      {
        level: 1,
        level_label: 'Novice',
        level_subtitle: 'Fails to recognise the need to change',
        indicators: [
          'Shows little appreciation of the need to change.',
          'Resists or opposes organisational change initiatives.',
          'Attempts to influence others negatively towards organisation-initiated change.',
        ],
      },
      {
        level: 2,
        level_label: 'Developing',
        level_subtitle: 'Implements change initiatives in own area',
        indicators: [
          'Follows existing policies and change processes and applies change in own area.',
          'Adapts processes and ways of working to give effect to change and new applications/systems.',
          'Provides feedback on the impact of change to seniors.',
          'Displays a positive attitude in the face of ambiguity and change.',
        ],
      },
      {
        level: 3,
        level_label: 'Proficient',
        level_subtitle:
          'Identifies & assesses need for change in line with organisational goals',
        indicators: [
          'Identifies new trends that impact on the organisation and makes recommendations for change.',
          'Defines the requirements and quantifies the business benefits to implementing change or new systems.',
          'Assesses the implications and impact of new technology solutions on current practices and adjusts systems or processes accordingly.',
          'Analyses costs and benefits of implementing new technology solutions.',
        ],
      },
      {
        level: 4,
        level_label: 'Highly Proficient',
        level_subtitle:
          'Evaluates change initiatives and advocates for change, develops change models',
        indicators: [
          'Recognises and responds quickly to shifting opportunities and risks.',
          'Evaluates change requirements and exploits specialist skills to identify possible new methods and standards that can be used.',
          'Develops a plan for implementation of change and process enhancement.',
          'Manages the change considering structural and cultural issues.',
        ],
      },
      {
        level: 5,
        level_label: 'Mastery',
        level_subtitle: 'Leads organisational change',
        indicators: [
          'Anticipates and capitalises on emerging opportunities and manages risks for the organisation.',
          'Provides leadership to plan, manage and implement significant technology-led business changes.',
          'Applies pervasive influence to embed organisational change.',
          'Considers and minimises the impact of changes in the industry or in general, on the organisation and its people/stakeholders.',
          'Creates a learning organisation.',
        ],
      },
    ],
  },
  {
    category: STRATEGIC,
    competency_name: 'Strategic Thinking',
    description:
      'Understands and processes complex information and exercises sound judgment, considering the situation, the issues, the key players, and levels of hierarchy involved. Proposes course of action that further the objectives, priorities and vision of the organisation.',
    sort_order: 13,
    levels: [
      {
        level: 1,
        level_label: 'Novice',
        level_subtitle: 'Fails to align actions and plans to the vision',
        indicators: [
          'Focuses on the here and now.',
          'Fails to think of long-term implications of issues.',
          'Works with operational issues where there are clear guidelines and structures.',
          'Depends on others to ensure alignment with the business goals and vision of the organisation.',
        ],
      },
      {
        level: 2,
        level_label: 'Developing',
        level_subtitle: 'Aligns personal work goals and actions to the vision',
        indicators: [
          'Able to translate strategic goals to operational goals in own area.',
          'Continually evaluates personal progress and actions to ensure alignment with organisational vision and operational goals.',
          'Demonstrates understanding of how own role assists in achieving the organisation’s vision.',
          'Focuses on short-term issues.',
        ],
      },
      {
        level: 3,
        level_label: 'Proficient',
        level_subtitle: 'Aligns team goals and actions to organisational vision',
        indicators: [
          'Applies strategic thinking concepts to articulate organisational strategies that are aligned to the vision.',
          'Helps team members understand the broader vision and how their work relates to it.',
          'Scans external and internal environments to identify and assess emerging trends, opportunities and threats that may influence future directions.',
          'Able to implement business process management.',
        ],
      },
      {
        level: 4,
        level_label: 'Highly Proficient',
        level_subtitle: 'Influences vision and strategic direction',
        indicators: [
          'Able to develop new business models.',
          'Shows strong strategic inclination and understands relationships between and within dynamic systems and uses this to formulate strategies that are aligned with organisational vision and mission.',
          'Defines issues, using theoretical models, generates options and selects solutions that are consistent with strategy and vision.',
          'Maintains a broad, strategic perspective while identifying and focusing on crucial details.',
          'Spots patterns and bring thinking from multiple perspectives together.',
          'Develops new approaches to learning, rewards, use of space and elimination of hierarchies.',
        ],
      },
      {
        level: 5,
        level_label: 'Mastery',
        level_subtitle: 'Shapes the vision and strategies and values of the organisation',
        indicators: [
          'Shows high level of strategic thinking and futuristic orientation.',
          'Defines and continuously articulates the vision and strategy in the context of wider government priorities and ambiguity.',
          'Structures and positions the organisation to government priorities as a significant player in the industry.',
          'Exploits existing and emerging technologies for better business outcomes.',
        ],
      },
    ],
  },
];
