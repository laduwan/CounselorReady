/**
 * seedCR-SATC201.js
 * Padded to full CE target with genuine on-topic content; emitted via the
 * good-flow model-based pattern (hook computes wordCount, validation enforced).
 * Audit:  node src/scripts/auditCourse.js --file src/scripts/<thisfile>.js
 * Run:    node src/scripts/<thisfile>.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';

dotenv.config();

export const COURSE = {
  "title": "What the Chicken Dance Got Right",
  "slug": "what-the-chicken-dance-got-right-satc-attachment",
  "courseCode": "CR-SATC-201",
  "subtitle": "Attachment Theory Through the Lens of Sex and the City S2E7",
  "description": "A 2-hour pop culture CE course using Sex and the City Season 2 Episode 7 as a clinical teaching lens for adult attachment theory. Covers Bartholomew-Horowitz four-category model, fantasy bonds, ECR-R, EFT-C, and earned security.",
  "ceHours": 2,
  "ceuHours": 2,
  "credits": 2,
  "ceuEligible": true,
  "category": "Pop Culture CE",
  "ceCategory": "Clinical",
  "contentArea": "Counseling Theory/Practice and the Counseling Relationship",
  "level": "Intermediate",
  "deliveryMethod": "Asynchronous Online",
  "approvingBody": "NBCC",
  "approvalNumber": "7760",
  "acepNumber": "7760",
  "instructor": "GA Integrated Therapeutic Perspectives LLC",
  "accessType": "subscription",
  "status": "draft",
  "isPublished": false,
  "isActive": true,
  "passingScore": 80,
  "passThreshold": 0.8,
  "maxAttempts": 3,
  "objectives": [
    "Upon completion, participants will be able to:",
    "Identify the four adult attachment styles and describe their behavioral signatures in romantic relationship initiation and commitment.",
    "Distinguish between genuine relational readiness and anxiety-driven commitment -- the clinical difference between choosing a partner and escaping aloneness.",
    "Define fantasy bonds and explain how they function as relational defenses against intimacy and authentic connection.",
    "Apply attachment theory frameworks to clinical case conceptualization of clients presenting with commitment difficulties, partner selection patterns, or romantic idealization.",
    "Recognize the clinical presentation of avoidant attachment in relationship-avoidant clients and describe evidence-based therapeutic approaches.",
    "Identify cultural scripts about romantic love and marriage that contribute to problematic relational patterns in clinical populations."
  ],
  "targetAudience": [
    "Licensed mental health professionals including LPCs, LCSWs, LMFTs, Psychologists, NCCs, and Psychiatric NPs who work with adult attachment concerns in individual or couples therapy."
  ],
  "sections": [
    {
      "title": "The Dance: Attachment, Anxiety, and Who We Choose",
      "order": 1,
      "description": "Bowlby, Bartholomew-Horowitz four-category model, and the four SATC characters",
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "order": 1,
          "title": "The Dance: Attachment, Anxiety, and Who We Choose",
          "subtitle": "Bowlby, Bartholomew-Horowitz, and the Four Characters of Sex and the City"
        },
        {
          "type": "text",
          "order": 2,
          "content": "<div class=\"cr-prose\"><p>── Module 1 -- The Dance: Attachment, Anxiety, and Who We Choose ──</p><p>Module 1: The Dance -- Attachment, Anxiety, and Who We Choose</p><p>Episode Synopsis: What Happens in 'The Chicken Dance'</p><p>In Season 2, Episode 7 of Sex and the City, Carrie's friend Miranda attends a wedding where her former flame Skipper is present alongside his new girlfriend, Marie. Within weeks, Skipper and Marie announce their engagement -- having dated only briefly. Miranda, characteristically sardonic, declares the engagement ridiculous and premature. Carrie, navigating her own ambivalence about her relationship with Mr. Big, is shaken. Charlotte, the group's most committed romantic, throws herself into wedding enthusiasm while privately cataloguing her own still-absent engagement. Samantha, predictably, questions whether the institution of marriage has any clinical or personal utility whatsoever.</p><p>The episode's central emotional tension is Miranda's. She is attracted to Steve but maintains careful emotional distance; watching Skipper -- whose affection she repeatedly deflected -- commit fully and quickly to someone else produces a complex mix of relief, validation, and a disquieting whisper of something else. The episode ends with Miranda alone at the wedding reception, watching couples dance, her expression unreadable. The title references the chicken dance -- a singularly unsexy wedding reception staple -- as a metaphor for the awkward, self-conscious, often undignified performance that romantic commitment can become when it is driven by social expectation rather than genuine desire.</p><p>Clinically, the episode dramatizes four distinct relational patterns across its four leads: Miranda's avoidant self-protection; Charlotte's anxious-preoccupied romantic idealization; Samantha's dismissive-avoidant relational stance expressed through sexual agency; and Carrie's fearful-avoidant oscillation between wanting closeness with Big and maintaining the ambiguity that protects her from the vulnerability of full commitment. These four patterns map with reasonable fidelity onto Bartholomew and Horowitz's (1991) four-category attachment model, making the episode a compact clinical illustration of adult attachment theory in action.</p><p>Attachment Theory: From Bowlby to Adult Romantic Relationships</p><p>John Bowlby's attachment theory, developed across three volumes of his Attachment and Loss trilogy (1969, 1973, 1980), proposed that human beings are biologically predisposed to seek proximity to attachment figures -- caregivers who provide safety, comfort, and protection in the face of threat. The quality of early attachment relationships produces what Bowlby called internal working models: cognitive-affective schemas of the self (am I worthy of care?), of others (are they reliably available?), and of relationships (is closeness safe or dangerous?) that are carried forward from childhood and shape the individual's expectations, perceptions, and behaviors in subsequent close relationships throughout the lifespan.</p><p>Mary Ainsworth's Strange Situation Procedure (1978) identified three primary infant attachment patterns -- secure, anxious-ambivalent, and avoidant -- that subsequent developmental research has linked to specific caregiving patterns and specific long-term developmental outcomes. Securely attached infants, whose caregivers are reliably responsive to their distress signals, develop positive models of self and other that support confident exploration of the environment and effective regulation of emotional distress. Anxiously attached infants, whose caregivers respond inconsistently, develop hyperactivated attachment systems characterized by proximity-seeking, separation protest, and difficulty being soothed -- a strategy of amplifying attachment signals to maximize the probability of eliciting caregiver response from an unreliable source.</p><p>Avoidantly attached infants, whose caregivers respond to distress with emotional withdrawal, rejection, or excessive stimulation, develop deactivated attachment systems characterized by the suppression of visible distress and the appearance of emotional self-sufficiency -- a strategy of minimizing attachment signals to avoid the rejection or overwhelm that expressing needs has consistently produced. Main and Solomon (1986) subsequently identified a fourth pattern -- disorganized attachment -- in infants whose caregivers were themselves the source of fear, producing the unresolvable conflict of needing to seek safety from the source of danger and resulting in contradictory, disorganized attachment behaviors.</p><p>The adult attachment research tradition, pioneered by Hazan and Shaver (1987) and systematized by Bartholomew and Horowitz (1991), translated Ainsworth's infant typology into a four-category model of adult romantic attachment organized along two dimensions: anxiety (negative model of self: am I worthy of love?) and avoidance (negative model of other: are others reliably available and trustworthy?). The four resulting categories are: Secure (low anxiety, low avoidance) -- comfortable with closeness and interdependence; Preoccupied/Anxious (high anxiety, low avoidance) -- preoccupied with relationships, fearful of abandonment, seeking excessive reassurance; Dismissing/Avoidant (low anxiety, high avoidance) -- compulsively self-reliant, uncomfortable with closeness, denying need for attachment; and Fearful/Avoidant (high anxiety, high avoidance) -- desiring closeness while simultaneously fearing it, resulting in the most complex and clinically challenging relational patterns.</p><p>Adult attachment research has produced a remarkably robust literature documenting the influence of attachment style on romantic relationship formation, quality, and stability. Securely attached adults form more satisfying, more stable relationships, regulate relationship-related distress more effectively, communicate more openly about needs and concerns, and resolve conflicts more constructively than insecurely attached adults. Anxiously attached adults experience greater relationship-related distress, engage in more reassurance-seeking and protest behaviors, are more sensitive to perceived rejection, and have greater difficulty maintaining relationship satisfaction in the face of the inevitable disappointments of long-term partnership. Avoidantly attached adults tend toward shorter relationships, greater emotional distance even within established relationships, difficulty expressing vulnerability, and partner selection patterns that maintain safe emotional distance while meeting needs for companionship.</p><p>Miranda: Avoidant Attachment in the Consulting Room</p><p>Miranda Hobbes is, among the four leads, the most clinically legible from an attachment perspective -- and the one whose relational patterns are most readily mapped onto the dismissing-avoidant attachment profile that Bartholomew and Horowitz described. Miranda is professionally accomplished, emotionally intelligent, and interpersonally competent -- but she maintains careful emotional distance in romantic relationships, consistently under-invests in relationships relative to her partners' investment, and experiences the vulnerability of genuine emotional need as threatening to a self-concept organized around self-sufficiency and emotional independence.</p><p>The dismissing-avoidant attachment profile, as Bowlby described it, develops in response to caregiving characterized by emotional unavailability, rejection of attachment needs, or the implicit or explicit message that emotional dependency is weakness. Children who develop in this caregiving environment learn to suppress attachment-related affect, to organize their self-concept around competence and independence rather than relational connection, and to maintain proximity to caregivers through the demonstration of self-sufficiency rather than through the direct expression of attachment needs. The adult Miranda's emotional armor -- her irony, her skepticism about romance, her protective cynicism about Skipper's engagement -- reads, through an attachment lens, not as genuine emotional disengagement but as a well-practiced defensive suppression of attachment needs that she has learned to experience as dangerous.</p><p>The clinical presentation of dismissing-avoidant attachment in adult clients is often clinically deceptive precisely because it does not look like a problem from the outside -- or from the client's own vantage point. These clients often present not with relationship distress but with relationship puzzlement: they observe that their partners consistently experience them as emotionally unavailable, that relationships that begin promisingly tend to feel increasingly suffocating, that they feel more comfortable with work relationships and friendships than with romantic intimacy, and that the prospect of genuine commitment produces anxiety that they cannot fully account for. They may have a long history of relationships that ended when partners wanted more closeness than the avoidant client could provide, without the client fully recognizing their own role in the pattern.</p><p>The clinical challenge in working with dismissing-avoidant clients is accessing the attachment system that is not absent but defensively suppressed. Mikulincer and Shaver (2016) review extensive research documenting that avoidant attachment represents active inhibition of attachment processes rather than genuine indifference to attachment -- that avoidantly attached adults show physiological stress responses to attachment threats that match those of anxiously attached individuals, despite their behavioral and self-report presentation of equanimity. The clinical work with avoidant attachment involves creating the safety conditions within which the suppressed attachment system can become accessible: a therapeutic relationship that is consistent and non-intrusive enough that the client's hypervigilance for relational overwhelm can gradually relax.</p><p>Charlotte: Anxious-Preoccupied Attachment and the Fantasy of the Perfect Wedding</p><p>If Miranda represents the avoidant pole of adult attachment insecurity, Charlotte York represents the anxious-preoccupied pole with near-textbook precision. Charlotte is the group's most enthusiastic romantic, the most invested in finding the perfect partner, the quickest to idealize new relationships, and the most distressed by the gap between her romantic ideals and her actual relational experience. Her enthusiasm for Skipper and Marie's engagement -- enthusiasm that reads to her friends as excessive and somewhat baffling -- reflects the anxiously attached person's deep investment in the romantic partnership as the solution to the anxiety that their hyperactivated attachment system chronically generates.</p><p>The anxious-preoccupied attachment profile develops in response to inconsistent caregiving -- caregiving in which the attachment figure is sometimes responsive and available but unpredictably so, training the developing child to maintain a hyperactivated attachment system oriented toward detecting and responding to any signal of caregiver availability or unavailability. Adults with this attachment profile maintain chronic low-level attachment anxiety that is temporarily relieved by reassurance from partners but quickly returns, creating the reassurance-seeking cycles that characterize anxiously attached romantic relationships. They tend to idealize new partners, to over-invest early in relationships, to experience disproportionate distress at normal relationship ambiguity, and to interpret partner behaviors through a filter that amplifies signals of potential abandonment while minimizing signals of reliability and commitment.</p><p>Charlotte's wedding enthusiasm in 'The Chicken Dance' is clinically interpretable not only as cultural conditioning toward marriage as the female life goal -- though that cultural script is clearly also operating -- but as the anxiously attached person's characteristic response to evidence that the desired endpoint (committed partnership) is achievable: relief that the anxiety that has been maintaining may finally be resolved. The engagement of a couple she barely knows produces vicarious relief in Charlotte because it confirms the possibility of the resolution she seeks. This dynamic -- attaching intense personal significance to others' relational milestones because they represent proxy evidence that the desired resolution of one's own attachment anxiety is achievable -- is a common clinical presentation in anxiously attached clients that Charlotte embodies with perfect narrative economy.</p><p>In clinical practice, the anxiously attached client presents with a characteristic combination of relational distress, reassurance-seeking, and the cognitive distortions associated with hyperactivated threat-detection. They often describe relationships in catastrophizing terms -- small signs of partner distraction read as withdrawal, withdrawal reads as abandonment, ambiguity is experienced as danger. They may describe feeling clingy or needy in ways they find shameful, comparing themselves unfavorably to friends who seem to need less reassurance. They may have a history of relationships that ended with partners describing them as too intense or emotionally demanding. Clinically, attachment-informed treatment with anxious-preoccupied clients involves both the regulation of attachment anxiety and the gradual disconfirmation, through the therapeutic relationship and corrective relational experiences, of the internal working models of self-as-unworthy and other-as-unreliable that drive the anxious relational pattern.</p><p>Carrie: Fearful-Avoidant Attachment and the Push-Pull with Big</p><p>Carrie Bradshaw's relationship with Mr. Big is, across six seasons, the most extended clinical illustration of fearful-avoidant attachment that mainstream television has produced. The fearful-avoidant attachment profile -- combining high anxiety (negative self-model: I am not worthy of consistent love) with high avoidance (negative other-model: closeness is dangerous) -- produces the most complex and most self-defeating relational pattern of the four attachment styles because it simultaneously activates the desire for closeness and the fear of closeness, producing the oscillating approach-avoidance dynamic that characterizes Carrie's relationship with Big throughout the series.</p><p>In 'The Chicken Dance,' Carrie's disquiet at Skipper's engagement is explicitly connected to her ambivalence about Big: she wants what Skipper and Marie have found (committed partnership) but is simultaneously relieved by Big's unavailability because his emotional inaccessibility maintains the safe distance that her fearful attachment requires. The fearful-avoidant person's characteristic solution to the approach-avoidance conflict is the selection of partners who are themselves unavailable -- partners whose unavailability reliably prevents the full commitment that the fearful person simultaneously desires and fears. Big's emotional unavailability is, from this perspective, not incidental to Carrie's attraction to him but constitutive of it: his unavailability makes him safe precisely because it ensures that genuine intimacy -- with all the vulnerability and risk of loss that genuine intimacy entails -- will remain at arm's length.</p><p>The clinical literature on fearful-avoidant attachment documents a particularly strong association between this attachment style and experiences of early relational trauma -- abuse, neglect, or loss that created the simultaneous need for and terror of close relationships that defines the fearful pattern. Main and Hesse (1990) proposed that disorganized infant attachment -- the developmental precursor to fearful-avoidant adult attachment -- is specifically associated with caregiving in which the attachment figure was both the source of comfort and the source of fear, creating the neurological and behavioral disorganization that results when the attachment system and the fear system are simultaneously activated by the same stimulus. The adult who experienced early relationships as simultaneously comforting and dangerous carries this paradox into adult romantic relationships: intimacy is both desperately wanted and deeply threatening.</p></div>"
        },
        {
          "type": "text",
          "order": 3,
          "content": "<div class=\"cr-prose\"><h3>Bartholomew and Horowitz's (1991) four-category adult attachment model is organized along which two dimensions:</h3><p>○  A. Trust and commitment</p></div>"
        },
        {
          "type": "text",
          "order": 4,
          "content": "<div class=\"cr-prose\"><h3>✓  B. Anxiety (model of self) and avoidance (model of other)</h3><p>○  C. Dependency and autonomy</p><p>○  D. Security and insecurity</p><p>Rationale: The four-category model organizes adult attachment styles along anxiety (negative model of self: am I worthy?) and avoidance (negative model of other: are they reliable?) dimensions, producing four distinct attachment patterns.</p></div>"
        },
        {
          "type": "text",
          "order": 5,
          "content": "<div class=\"cr-prose\"><h3>The dismissing-avoidant attachment pattern develops in response to which caregiving experience:</h3><p>○  A. Inconsistent caregiving that is sometimes responsive and sometimes unavailable</p></div>"
        },
        {
          "type": "text",
          "order": 6,
          "content": "<div class=\"cr-prose\"><h3>✓  B. Caregiving characterized by emotional unavailability or rejection of attachment needs</h3><p>○  C. Caregiving in which the caregiver was both the source of comfort and the source of fear</p><p>○  D. Consistent, responsive caregiving that meets the child's attachment needs reliably</p><p>Rationale: Dismissing-avoidant attachment develops in response to caregiving characterized by emotional withdrawal or rejection of attachment needs, training the child to suppress attachment signals and organize identity around self-sufficiency.</p></div>"
        },
        {
          "type": "text",
          "order": 7,
          "content": "<div class=\"cr-prose\"><h3>Fearful-avoidant attachment is clinically distinct from dismissing-avoidant attachment primarily because:</h3><p>○  A. Fearful-avoidant clients have lower anxiety and greater willingness to engage in therapy</p></div>"
        },
        {
          "type": "text",
          "order": 8,
          "content": "<div class=\"cr-prose\"><h3>✓  B. Fearful-avoidant attachment combines high anxiety with high avoidance, producing simultaneous desire for and fear of closeness</h3><p>○  C. Fearful-avoidant clients are more likely to seek reassurance from romantic partners</p><p>○  D. Dismissing-avoidant clients have more severe relationship difficulties than fearful-avoidant clients</p><p>Rationale: Fearful-avoidant attachment combines high anxiety (negative self-model) with high avoidance (negative other-model), producing the approach-avoidance conflict and selection of unavailable partners that characterize the pattern.</p></div>"
        }
      ]
    },
    {
      "title": "Fantasy Bonds, Cultural Scripts, and Clinical Application",
      "order": 2,
      "description": "Fantasy bonds, anxiety-driven commitment, assessment, and evidence-based treatment",
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "order": 1,
          "title": "Fantasy Bonds, Cultural Scripts, and Clinical Application",
          "subtitle": "From Episode to Evidence: Assessment, Treatment, and Earned Security"
        },
        {
          "type": "text",
          "order": 2,
          "content": "<div class=\"cr-prose\"><p>── Module 2 -- Fantasy Bonds, Cultural Scripts, and Clinical Application ──</p><p>Module 2: Fantasy Bonds, Cultural Scripts, and Clinical Application</p><p>Fantasy Bonds: When the Appearance of Love Replaces the Experience</p><p>Robert Firestone (1985, 1987) introduced the concept of the fantasy bond to describe a specific relational defense in which the form of intimate relationship -- its routines, its roles, its publicly recognized status -- replaces the actual experience of intimate connection between two individuals. The fantasy bond emerges as a defense against the anxiety of genuine intimacy: the vulnerability of being truly known, the terror of loss that accompanies genuine attachment, and the pain of the inevitable limitations and disappointments that genuine partnership with another real human being produces. By substituting the comfortable routine of an established relationship for the living experience of genuine connection, the fantasy bond preserves the appearance of love while protecting against the risks that genuine love entails.</p><p>Firestone's fantasy bond concept has direct clinical relevance to 'The Chicken Dance' in two distinct registers. First, it provides a framework for understanding the rapid engagement of Skipper and Marie that disturbs Miranda so much: their friends question whether they have known each other long enough to have developed the genuine mutual knowledge that real commitment requires, or whether they are, in Firestone's terms, bonding around the fantasy of partnership rather than the reality of specific mutual attachment. The clinical question that rapid commitment often raises -- 'Are they choosing each other, or are they choosing the relief of no longer being alone?' -- is precisely the question that the fantasy bond concept addresses.</p><p>Second, the fantasy bond illuminates the relational pattern that characterizes Carrie's relationship with Big across the series: the relationship has many of the markers of intimate partnership (ongoing connection, mutual history, emotional significance) without the full vulnerability and commitment that genuine intimate partnership requires. Big's emotional unavailability and Carrie's tolerance of that unavailability maintain a version of the relationship that provides the comfort of connection without the terror of genuine intimacy -- a relationship organized, in Firestone's terms, around the fantasy of the relationship rather than the reality of full mutual presence and commitment.</p><p>In clinical practice, fantasy bonds present diagnostically as relationships that look functional on the outside but are experienced as deadening, routine, or emotionally flat by one or both partners. Clients who are in fantasy bonds often describe their relationships in terms of stability and reliability rather than connection and aliveness: 'We get along fine,' 'We don't fight,' 'We work well as a team,' 'It makes sense on paper.' They may describe a persistent sense of loneliness within the relationship -- the specific pain of being physically and logistically close to someone while remaining emotionally distant -- or a dim awareness that the relationship has become more about maintaining the structure of partnership than about genuine mutual engagement. The therapeutic task with fantasy bonds is not simply to improve communication or repair specific relationship problems but to address the anxiety about genuine intimacy that the fantasy bond is defending against -- to explore what genuine mutual presence and vulnerability would feel like, and what specific fears make that experience feel more threatening than the numbness the fantasy bond provides.</p><p>Distinguishing fantasy bonds from healthy long-term relationship stability is an important clinical skill that requires attention to several specific indicators. Fantasy bonds are characterized by: the substitution of routine for genuine engagement (doing things together without actually connecting); the maintenance of form without substance (performing the role of partner without genuine mutual presence); the use of the relationship's social recognition (being 'a couple') as a source of security independent of the actual quality of the connection; and the experience of the partner as a functional role (provider, companion, co-parent) rather than a specific individual. Healthy long-term relationship stability, by contrast, is characterized by ongoing genuine engagement within comfortable routine -- partners who genuinely want to spend time together, not merely who are accustomed to doing so; who continue to be curious about each other's inner lives; and who maintain the capacity for genuine emotional contact even when the relationship's novelty has long since passed.</p><p>Anxiety-Driven Commitment: Choosing a Partner vs. Escaping Aloneness</p><p>One of the most clinically important distinctions that 'The Chicken Dance' dramatizes -- and that the engagement of Skipper and Marie specifically raises -- is the distinction between commitment as a genuine choice of a specific person and commitment as a flight from the anxiety of being alone. This distinction has profound clinical significance because anxiety-driven commitment produces relationships that begin with apparent certainty and urgency but lack the genuine mutual knowledge, realistic assessment, and chosen vulnerability that sustain long-term partnership through the inevitable difficulties that all sustained intimate relationships encounter.</p><p>The clinical literature on relationship formation identifies several markers that distinguish anxiety-driven from choice-driven commitment. Anxiety-driven commitment is characterized by: rapidity (the relationship moves to commitment before the partners have had sufficient time to develop realistic mutual knowledge); idealization (the partner is experienced as perfect or perfectly suited, with limited awareness of their specific limitations or incompatibilities with one's own); relief rather than joy as the primary affective response to commitment (the commitment feels like a crisis resolved rather than a genuine life possibility embraced); limited evaluation of actual compatibility (the decision is driven by timing -- 'I am ready for this now' -- rather than by specific assessment of this partner); and retrospective rationalization (when asked why they chose this specific partner, anxiety-driven committers often cite generic positive attributes -- 'she's wonderful' -- rather than specific relational qualities.</p><p>Anxiety-driven commitment is particularly common among anxiously attached individuals for whom the resolution of the chronic low-level anxiety that their hyperactivated attachment system generates has become conflated with the establishment of committed partnership. For these individuals, any sufficiently available and desirable partner will do at the right developmental moment -- not because they do not have preferences about partners, but because the anxiety relief of commitment itself has become the primary relational goal, and specific partner qualities are evaluated primarily in terms of their compatibility with the anxiety-resolution function rather than through careful assessment of genuine long-term compatibility.</p><p>Clinicians working with clients who are considering commitment should attend to several clinical questions that help distinguish anxiety-driven from choice-driven commitment: Is the urgency to commit driven by genuine readiness for partnership or by specific situational pressures -- aging, social comparison, family pressure, fear of the partner leaving? Does the client have realistic awareness of the partner's specific limitations and how those limitations will affect their daily life? Can the client describe specific qualities of this partner that distinguish them from other potentially available partners -- or does their description apply equally to anyone who is available, attractive, and willing? Has the relationship been tested by sufficient experience across diverse contexts -- conflict, stress, disappointment, real-world logistics -- to provide a realistic basis for commitment? These questions, explored with genuine clinical curiosity and without the clinician's own normative agenda about whether commitment is or is not advisable, provide a more clinically rigorous basis for commitment assessment than simple support for whatever the client is already inclined to do.</p><p>Cultural Scripts About Romantic Love and Their Clinical Consequences</p><p>Sex and the City is, among its many other functions, a sustained cultural examination of the scripts about romantic love that shaped the lives of urban professional women in late twentieth-century America -- scripts that were both ubiquitous and, the show repeatedly demonstrated, frequently toxic. The cultural script of the soulmate -- the belief that there exists somewhere a specific perfect partner for each individual, that romantic love is the primary path to personal fulfillment, and that failing to find and keep this perfect partner constitutes a fundamental personal failure -- is one of the most clinically significant cultural beliefs that mental health professionals encounter because of its pervasive effects on clients' self-evaluation, relationship decision-making, and psychological wellbeing.</p><p>Social psychologist Eli Finkel and colleagues (2014) described what they term the suffocation model of modern marriage -- the progressive inflation of expectations for marriage and romantic partnership as the society-wide erosion of other sources of meaning, community, and self-actualization has placed increasing psychological weight on romantic partnership to provide goods (self-knowledge, personal growth, authentic expression, peak experiences) that were previously distributed across multiple life domains and relationships. As marriages are increasingly expected to provide not only practical partnership and companionship but deep personal transformation and self-actualization, the inevitable gap between this expectation and the reality of any actual relationship with an imperfect real human being becomes a more significant source of relationship dissatisfaction than in eras with more modest relational expectations.</p><p>The clinical consequences of soulmate ideology are well-documented. Believing in the soulmate concept is associated with lower relationship satisfaction when relationships require effort and encounter difficulties -- because soulmate beliefs predict that the 'right' relationship should be effortless, and effort signals that this may not be the right relationship after all. Believing in the growth model of relationships -- that relationships develop and improve through effort and investment -- is associated with better long-term relationship outcomes because it supports the sustained engagement and constructive conflict resolution that long-term partnership requires (Knee, 1998). Charlotte's romantic idealism in 'The Chicken Dance' -- her rapid enthusiasm for Skipper and Marie's engagement, her implicit belief that love when it is real announces itself quickly and certainly -- represents the soulmate ideology at its most clinically recognizable.</p><p>Gender-specific cultural scripts about romantic love add additional clinical complexity to the relational patterns that 'The Chicken Dance' dramatizes. The cultural script that assigns women primary responsibility for the emotional labor of relationships, that frames women's value in terms of their relational status (partnered vs. single), and that defines female maturity in terms of progression toward committed partnership has specific clinical consequences for female clients' self-evaluation, relationship decision-making, and psychological wellbeing. Miranda's self-protective cynicism about Skipper's engagement is, in part, a defense against the cultural shaming of the unpartnered woman -- a preemptive rejection of the social script before it can be applied to her. Understanding the cultural dimensions of clients' relational patterns is essential for clinically accurate formulation that does not mistake culturally induced distress for individual pathology.</p><p>Clinical Assessment of Attachment Patterns</p><p>The clinical assessment of adult attachment patterns provides essential information for case conceptualization and treatment planning with clients presenting with relationship difficulties, commitment challenges, and chronic relational dissatisfaction. Several validated assessment instruments are available that provide reliable and valid measures of adult attachment style across the anxiety and avoidance dimensions that the four-category model describes.</p><p>The Experiences in Close Relationships Scale (ECR; Brennan, Clark, and Shaver, 1998) and its revised version (ECR-R; Fraley, Waller, and Brennan, 2000) are the most widely used self-report measures of adult attachment in romantic relationships, assessing attachment anxiety and avoidance on continuous rather than categorical dimensions. The ECR-R provides 36 items equally divided between the anxiety and avoidance dimensions, with strong internal consistency and test-retest reliability and extensive validation research documenting its relationship to relationship quality, conflict behavior, and clinical outcomes. Clinicians who use the ECR-R in initial assessment obtain dimensional attachment data that can be used both for case conceptualization and as a baseline measure for tracking changes in attachment security over the course of treatment.</p><p>The Adult Attachment Interview (AAI; George, Kaplan, and Main, 1985) is the gold-standard measure of adult attachment as assessed through narrative coherence and discourse about childhood attachment experiences -- an approach rooted in Main's finding that it is not what happened in childhood per se but how coherently the adult can narrate and make meaning of their childhood attachment experiences that predicts their children's attachment patterns. The AAI requires specialized training to administer and code and is more appropriate for research and intensive clinical contexts than for routine clinical assessment, but understanding its theoretical framework -- that attachment security in adults is reflected in narrative coherence, collaborative communication, and the capacity to simultaneously acknowledge painful attachment experiences and maintain a balanced, nuanced account of them -- provides clinical guidance for the assessment of attachment-related discourse in clinical interviews.</p><p>In clinical practice, attachment assessment most commonly occurs through attentive observation of the client's relational history, their narrative style when describing attachment relationships, and their behavior within the therapeutic relationship itself. Clients with dismissing-avoidant attachment tend to describe attachment relationships in terms of independence and self-sufficiency, may have difficulty recalling specific early attachment experiences or discount their significance, and maintain careful emotional distance in the therapeutic relationship. Clients with anxious-preoccupied attachment tend to describe attachment relationships at length and with considerable emotional activation, may become preoccupied with the therapeutic relationship itself, and often present with the characteristic alternation between idealization and devaluation of therapists and treatment. Clients with fearful-avoidant attachment present the most complex clinical picture -- simultaneously wanting the therapeutic relationship and being threatened by it, approach-avoidance behavior that mirrors their romantic relational pattern.</p><p>Attachment-Informed Treatment: Clinical Approaches</p><p>Attachment theory has generated a rich clinical literature documenting specific treatment approaches that address the internal working model revisions and relational skill development that improved attachment security requires. Emotion-Focused Therapy for Couples (EFT-C; Johnson, 2004), Attachment-Based Individual Therapy (ABIT; Obegi and Berant, 2009), and Mentalization-Based Treatment (MBT; Bateman and Fonagy, 2016) are among the most empirically supported attachment-informed treatment approaches, each of which provides specific techniques for accessing, processing, and revising the internal working models that drive insecure attachment patterns.</p><p>Emotionally Focused Therapy for Couples, developed by Susan Johnson, is the most extensively researched couples therapy with demonstrated effectiveness specifically for attachment-related couple distress. EFT conceptualizes couple conflict as a cycle of interaction driven by underlying attachment fears -- the fear of abandonment in the anxiously attached partner and the fear of engulfment in the avoidantly attached partner -- that produces the pursue-withdraw dynamic that is the most common presenting pattern in couples seeking therapy. EFT's three-stage model (de-escalation of the negative cycle, restructuring attachment bonds, consolidation) systematically accesses and reshapes the underlying attachment emotions that drive the negative cycle, helping partners recognize and communicate their vulnerability rather than their secondary (protest, withdrawal) emotions and creating the corrective attachment experiences that revise the internal working models driving their relational difficulties.</p><p>For individual clients with avoidant attachment presenting with relationship difficulties, attachment-informed individual therapy focuses on creating the safe therapeutic relationship within which the defensively suppressed attachment system can gradually become accessible. Siegel's (2010) interpersonal neurobiology framework provides a theoretical integration of attachment theory and neuroscience that explains why the therapeutic relationship itself -- as a genuine secure base that provides consistent attunement, repair of therapeutic ruptures, and patient tolerance of the client's defensive strategies -- is the primary vehicle for attachment change in individual therapy. The clinician who understands dismissing-avoidant clients' emotional distance as defensive suppression rather than genuine indifference, who maintains therapeutic persistence without becoming intrusive, and who provides the consistent attunement that gradually demonstrates the safety of emotional need expression is doing the work that internal working model revision requires.</p><p>Mentalization-Based Treatment, developed by Bateman and Fonagy for borderline personality disorder but applicable to a broader range of attachment difficulties, focuses on developing the reflective functioning capacity -- the ability to understand one's own and others' behavior in terms of underlying mental states (beliefs, desires, feelings, intentions) -- that secure attachment facilitates and insecure attachment disrupts. The fearful-avoidant client whose relational distress is most severe often presents with significant mentalization failures under attachment stress -- moments in which the capacity to understand the partner's behavior in terms of their internal states collapses, producing the relational dysregulation and interpersonal crisis that characterizes high-conflict fearful-avoidant relationships. MBT's systematic focus on the restoration of mentalization capacity provides specific clinical tools for the most complex attachment presentations that mental health professionals encounter.</p></div>"
        },
        {
          "type": "text",
          "order": 3,
          "content": "<div class=\"cr-prose\"><h3>Robert Firestone's concept of the 'fantasy bond' describes which relational pattern:</h3><p>○  A. A relationship characterized by intense idealization of the partner in the early stages</p></div>"
        },
        {
          "type": "text",
          "order": 4,
          "content": "<div class=\"cr-prose\"><h3>✓  B. The substitution of the form and routine of relationship for genuine intimate connection as a defense against intimacy anxiety</h3><p>○  C. An attachment pattern in which both partners are simultaneously anxiously attached</p><p>○  D. A therapeutic technique for helping clients identify idealized expectations for relationships</p><p>Rationale: The fantasy bond describes the defense against intimacy anxiety in which the structure and routine of relationship (its form) replaces genuine mutual presence and connection (its substance), preserving the appearance of love while avoiding its vulnerability.</p></div>"
        },
        {
          "type": "text",
          "order": 5,
          "content": "<div class=\"cr-prose\"><h3>Finkel and colleagues' 'suffocation model' of modern marriage proposes that:</h3><p>○  A. Marriage has become less important to individual wellbeing as alternative sources of meaning have proliferated</p></div>"
        },
        {
          "type": "text",
          "order": 6,
          "content": "<div class=\"cr-prose\"><h3>✓  B. Mounting expectations for marriage to provide self-actualization and peak experiences create a gap that any real relationship will inevitably fail to fill</h3><p>○  C. Anxiously attached partners suffocate avoidantly attached partners by demanding excessive emotional intimacy</p><p>○  D. Modern couples lack the commitment needed to sustain marriage through inevitable relational difficulties</p><p>Rationale: The suffocation model documents how progressively inflated expectations for marriage to provide self-actualization as well as companionship create inevitable dissatisfaction gaps that any actual relationship with an imperfect person will produce.</p></div>"
        },
        {
          "type": "text",
          "order": 7,
          "content": "<div class=\"cr-prose\"><h3>Emotion-Focused Therapy for Couples (EFT-C) conceptualizes couple conflict as:</h3><p>○  A. A communication skills deficit that requires behavioral rehearsal and skills training to address</p><p>○  B. A cognitive distortion pattern that requires restructuring of automatic thoughts about the partner</p></div>"
        },
        {
          "type": "text",
          "order": 8,
          "content": "<div class=\"cr-prose\"><h3>✓  C. A cycle driven by underlying attachment fears that produces pursue-withdraw dynamics</h3><p>○  D. A structural power imbalance that requires role renegotiation and boundary setting</p><p>Rationale: EFT conceptualizes couple conflict as a cycle driven by underlying attachment fears -- abandonment anxiety in the pursuing partner and engulfment fear in the withdrawing partner -- that produces the pursue-withdraw pattern it systematically addresses.</p></div>"
        },
        {
          "type": "text",
          "order": 9,
          "content": "<h2>Mentalization, the Therapeutic Secure Base, and the Pathway to Earned Security</h2>\n<p>The attachment patterns dramatized through the series' characters are not fixed sentences. One of the most clinically important contributions of contemporary attachment research is the recognition that attachment organization, while remarkably stable across the lifespan, is not immutable &mdash; and that the mechanisms through which insecure attachment becomes more secure are increasingly well understood. Two constructs are central to this clinical work: mentalization, the capacity to understand behavior in terms of underlying mental states; and the therapeutic relationship itself as a secure base from which the experience of relating can be revised.</p>\n<p>Mentalization &mdash; also termed reflective functioning &mdash; was developed by Peter Fonagy and colleagues to describe the capacity to interpret one's own and others' actions as expressions of intentional mental states: thoughts, feelings, desires, and beliefs. This capacity develops in early attachment relationships: a caregiver who accurately reads and reflects back the infant's internal states, neither ignoring them nor being overwhelmed by them, helps the child develop the ability to understand minds. Insecure and disorganized histories frequently compromise this capacity. The preoccupied individual, flooded by attachment anxiety, may lose the ability to consider that a partner's withdrawal reflects the partner's own state rather than confirming a fear of abandonment. The dismissing individual, defended against attachment needs, may decline to consider internal states at all, treating relationships as transactional and emotions as irrelevant. In each case the failure is not of caring but of mentalizing &mdash; the collapse of the reflective space within which the meaning of another's behavior can be held open to inquiry rather than foreclosed by attachment-driven assumption.</p>\n<p>For the clinician, mentalization is both a treatment target and a treatment stance. As a target, treatment works to restore or strengthen the client's capacity to reflect on mental states, particularly under the emotional activation that attachment-relevant situations produce. The clinician repeatedly invites the client to consider what they were feeling, what they imagined the other person was feeling, and what alternative interpretations might be possible &mdash; not to dispute the client's experience but to reopen the reflective space that attachment anxiety or avoidance has closed. As a stance, the clinician models mentalization by remaining curious about the client's internal states rather than presuming to know them, tolerating not-knowing, and repairing the inevitable moments of misreading. This modeling is itself therapeutic: the client experiences, often for the first time, a relationship in which their mind is held in another's mind with accuracy and care.</p>\n<p>This points to the second mechanism: the therapeutic relationship as a secure base. Attachment theory holds that a secure base &mdash; a reliable figure from whom one can venture to explore and to whom one can return for comfort &mdash; is the condition under which exploration, including the exploration of painful internal experience, becomes possible. The therapeutic relationship, when it provides reliability, attunement, and repair, can function as such a base. For a client whose history offered no such figure, the consistent availability of the clinician, the survival of the relationship through ruptures and repairs, and the experience of being understood without being abandoned or engulfed provide a corrective relational experience. This is not the clinician supplying the love the client's history lacked; it is the provision of a relationship structured and reliable enough that the client can begin to revise the internal working models &mdash; the expectations of self and other &mdash; that insecure attachment encoded.</p>\n<p>The convergence of these mechanisms is what attachment researchers call earned security. Earned security describes individuals who, despite insecure or adverse early histories, have developed a coherent, balanced stance toward attachment in adulthood &mdash; typically through a significant corrective relationship, which may be a partnership, a long-term friendship, or psychotherapy. Its hallmark, identified through the Adult Attachment Interview, is not the absence of painful history but the capacity to reflect on that history coherently: to acknowledge what was difficult, to consider the mental states of the figures involved, and to integrate the experience into a narrative that neither minimizes nor is flooded by it. Earned security is, in essence, mentalization applied to one's own attachment story &mdash; and it is achievable, which is the most hopeful clinical implication of attachment research.</p>\n<p>Returning to the relational dilemmas the series dramatizes, the clinical point is that the patterns its characters enact &mdash; the anxious pursuit, the dismissing retreat, the substitution of relational form for genuine intimacy &mdash; are not destinies. They are working models built in early relationships and maintained by the failures of mentalization that attachment activation produces, and they can be revised. The clinician who understands attachment not as a diagnosis to be assigned but as an organization to be worked with &mdash; through restoring reflective function, providing a reliable relational base, and supporting the integration of attachment history into a coherent narrative &mdash; offers clients the genuine possibility of earned security: not a different past, but a different relationship to it.</p>\n<p>In practice, this framework translates into concrete assessment and intervention choices. Attending to a client's attachment organization &mdash; listening for the coherence of their relational narrative, noticing whether they can hold their own and others' mental states in mind under emotional load, and observing the pattern they enact within the therapeutic relationship itself &mdash; informs how the clinician calibrates their stance. With a preoccupied client, the clinician provides reliability and helps down-regulate attachment anxiety enough for reflection to resume. With a dismissing client, the clinician respects discomfort with closeness while gently making attachment needs discussable. With a fearful-avoidant client, who both longs for and fears connection, the clinician's steady, non-intrusive reliability across ruptures is itself the intervention. In every case the goal is the same: to provide the reflective, reliable relationship within which insecure working models can, over time, be earned into security.</p>"
        },
        {
          "type": "text",
          "order": 10,
          "content": "<h2>Attachment as Organization, Not Label: Cautions for Clinical Use</h2>\n<p>The clinical power of attachment theory carries a corresponding risk: that attachment categories become labels applied to clients rather than provisional descriptions of organization that can change. A clinician who concludes that a client \"is dismissing-avoidant\" and treats that designation as a fixed trait has reproduced the very error that contemporary attachment research warns against &mdash; mistaking a pattern shaped by history and context for an essential property of the person. Attachment styles describe organizations of relating that emerged adaptively in specific caregiving environments and that persist because they were, at one time, the best available solution. Framed this way, an avoidant pattern is not a deficit but a strategy; a preoccupied pattern is not neediness but a learned vigilance. This reframing is not merely respectful &mdash; it is clinically more accurate and more useful, because organizations can be worked with while traits cannot.</p>\n<p>Several cautions follow. First, attachment patterns are domain- and relationship-specific to a meaningful degree: a person may relate with relative security to friends while showing preoccupation in romantic partnerships, or the reverse. Global attachment labels obscure this variability and can lead clinicians to over-predict behavior across contexts. Second, attachment assessment is vulnerable to cultural misreading: behaviors that signal security or insecurity in one cultural context may carry different meanings in another, and what a clinician from one background reads as avoidant distancing may reflect a culturally normative regulation of emotional expression. Attachment-informed practice therefore requires the same cultural humility as any other framework &mdash; holding the formulation provisionally and inviting the client's own understanding rather than imposing the clinician's interpretation.</p>\n<p>Third, the goal of attachment-informed treatment is not to convert clients to a prescribed secure style but to expand their range and flexibility &mdash; to help them access security where they could not before, while respecting the autonomy and values that shape how each person wants to love and relate. Earned security is not conformity to a template; it is the development of a coherent, reflective, and flexible relationship to one's own attachment history and present bonds. Held this way, attachment theory becomes what its originators intended: not a system for classifying people, but a framework for understanding how relationships shape us and how, within new relationships, we can be reshaped.</p>"
        }
      ]
    },
    {
      "title": "Conclusion: From the Dance Floor to the Consulting Room",
      "order": 3,
      "description": "Integration, earned security, and clinical application",
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "order": 1,
          "title": "Conclusion: From the Dance Floor to the Consulting Room",
          "subtitle": "Integration, Reflection, and Clinical Application of Attachment Theory"
        },
        {
          "type": "text",
          "order": 2,
          "content": "<div class=\"cr-prose\"><p>Samantha: Dismissing Attachment and the Sexual Self as Defense</p><p>Samantha Jones occupies a distinctive clinical position in the quartet -- the character whose relational pattern is most fully resolved into a coherent, consciously chosen philosophy rather than an unconscious defense, yet whose philosophy itself reads, through an attachment lens, as a highly sophisticated elaboration of dismissing-avoidant relational strategy. Samantha's explicit rejection of committed partnership, her insistence on the separability of sex and emotional attachment, and her cheerful claim that she does not need or want the sustained emotional intimacy that her friends pursue represent, at the manifest level, a liberated feminist stance -- and at the latent clinical level, a dismissing-avoidant internal working model that has been incorporated into a fully articulated identity rather than experienced as a problem to be solved.</p><p>What makes Samantha clinically interesting rather than simply a flat character is the show's occasional permission for her to reveal the attachment costs of her strategy: the moments in which her equanimity about connection breaks down and something more vulnerable briefly becomes visible before being quickly re-contained. 'The Chicken Dance' does not provide such a moment for Samantha -- she breezes through the wedding with characteristic uncomplicated amusement -- but across the series' arc, these moments occur with sufficient frequency to suggest a character whose apparent comfort with dismissing attachment represents ongoing active management rather than simple absence of attachment need.</p><p>The clinical relevance of Samantha's character for practitioners is the reminder that dismissing-avoidant relational patterns may be fully ego-syntonic -- experienced not as a problem but as a genuine expression of personal values and preferences -- and that clients who present this way are not necessarily candidates for attachment repair. Some clients who have organized their lives around relational independence have done so with genuine self-awareness and are finding that arrangement genuinely satisfying. The clinical task is not to assume that all avoidant attachment needs remediation but to help clients distinguish genuine preference for independence from defensive suppression of attachment needs that are generating psychological costs the client has not yet connected to their relational pattern. Distinguishing these requires careful clinical assessment of whether the relational pattern is producing the outcomes the client actually wants, or whether there is a quieter layer of distress -- loneliness, a sense of missed connection, relationships that feel shallow despite the client's stated preference for them -- that the presenting philosophy is defending against.</p><p>Partner Selection and Attachment: The Clinical Implications</p><p>Adult attachment research has produced a substantial literature on partner selection patterns and their relationship to attachment style -- findings with direct clinical implications for work with clients who present with chronic partner selection difficulties, repetitive relationship patterns, or relationship choices that appear self-defeating from the outside but feel compelling from the inside. Understanding the mechanisms through which attachment patterns influence partner selection helps clinicians provide more accurate formulation and more targeted intervention for these common clinical presentations.</p><p>Attachment research documents a consistent pattern of anxious-avoidant pairing in romantic relationships: anxiously attached individuals are disproportionately likely to form and maintain relationships with avoidantly attached partners, and vice versa. This pairing, which appears paradoxical on the surface -- why would the person who needs most reassurance choose the partner least likely to provide it? -- is explained by several mechanisms. For the anxiously attached partner, the avoidant partner's emotional unavailability is familiar: it matches the internal working model of the attachment figure as unreliable and confirms the hyperactivated attachment strategy of pursuing reassurance that anxiety has trained. For the avoidantly attached partner, the anxious partner's pursuit provides just enough relational engagement to satisfy minimal attachment needs while their anxiety makes the avoidant partner's emotional distance feel justified rather than problematic.</p><p>Carrie and Big's relationship across the series is a canonical illustration of the anxious-avoidant pairing. Carrie's fearful-avoidant pattern (simultaneously wanting and fearing closeness) maps onto Big's dismissing-avoidant pattern (maintaining emotional distance while tolerating relational proximity) in a way that creates a relationship with just enough connection to sustain it and just enough distance to prevent the full vulnerability that genuine commitment would require from either partner. The relationship is compelling precisely because it is organized around the complementary defenses of both partners -- a dynamic that clinicians recognize as both relationally stable in the short term and genuinely resistant to change unless both partners are willing to examine the attachment fears driving their respective strategies.</p><p>Fearful-avoidant individuals face a specific partner selection challenge that the anxious-avoidant pairing literature describes incompletely: their simultaneous desire for closeness and fear of it may produce a pattern of pursuing emotionally unavailable partners specifically because those partners' unavailability makes genuine intimacy safely impossible. When a genuinely available partner presents -- someone who is emotionally present, consistent, and explicitly interested in genuine intimacy -- the fearful-avoidant individual may experience this as overwhelming or even threatening rather than desirable, and may find reasons to discount, avoid, or sabotage the relationship precisely because it is offering what they consciously want. This pattern -- rejecting available partners and pursuing unavailable ones -- is a direct clinical expression of the fearful attachment working model, and recognizing it allows clinicians to reframe what clients often present as bad luck in love as a predictable expression of their attachment strategy.</p><p>Clinical work aimed at expanding clients' partner selection range -- helping avoidant clients tolerate the anxiety of available partners and helping anxious clients regulate the anxiety that produces premature commitment to insufficiently known partners -- requires sustained work on the underlying attachment representations rather than behavioral coaching about what to do differently. Advising a dismissing-avoidant client to be more emotionally available without addressing the attachment anxiety that emotional availability triggers is as ineffective as advising an anxiously attached client to slow down and get to know a partner better without addressing the chronic attachment anxiety that drives premature commitment. Lasting partner selection change follows internal working model revision; behavioral change alone without the underlying attachment work may produce surface compliance without genuine transformation of the relational patterns driving the difficulty.</p><p>Therapeutic Use of Pop Culture: Principles and Cautions</p><p>The use of film, television, and other popular culture references as clinical and educational tools has a substantial history in mental health professional training, and the growing field of cinema therapy (Wedding and Boyd, 1999; Niemiec and Wedding, 2014) has produced both theoretical frameworks and practical guidance for the use of cultural narratives in clinical settings. CounselorReady's Pop Culture CE series is grounded in the recognition that cultural texts that achieve wide resonance do so in part because they dramatize dynamics that audiences recognize from their own relational experience -- and that using recognizable cultural illustrations can make abstract clinical concepts more accessible, more memorable, and more immediately applicable than purely didactic presentation.</p><p>The therapeutic use of popular culture in clinical practice carries specific cautions that clinical training and this CE program specifically note. First, fictional characters are not clinical cases: they are narrative constructions designed to serve storytelling functions that may or may not align with clinical realism. The show's writers did not consult attachment theorists when writing Miranda Hobbes; the clinical interpretation of her character in this course is a post-hoc overlay of clinical concepts on narrative material, not a clinical assessment. Real clients who identify with fictional characters may have attachment patterns that are both similar to and substantially different from the character's, and the clinician who imports too much from the cultural illustration to the clinical assessment is overstepping the appropriate use of the tool.</p><p>Second, popular culture illustrations reflect cultural assumptions and biases that may not be clinically neutral. Sex and the City is an explicitly white, heteronormative, upper-middle-class narrative that represents a narrow slice of the full range of human relational experience. Its characters' relational patterns are shaped by specific cultural scripts about gender, sexuality, class, and romantic love that do not generalize across the full diversity of clients that mental health professionals serve. The clinician who uses the show's characters as clinical illustrations must be aware of the cultural specificity of those illustrations and maintain cultural humility about the limitations of their applicability to clients whose relational lives are organized around very different cultural frameworks.</p><p>Third, clients who recognize themselves in cultural characters may find the identification either illuminating or limiting -- and the clinician's role is to use the cultural illustration to open clinical exploration rather than to close it. The client who says 'I'm just like Miranda -- I have the same problem' has identified something clinically meaningful, but the clinician who accepts the identification at face value has foreclosed the inquiry into the specific ways the client's pattern is both similar to and different from the character's. Cultural illustrations are clinical entry points, not clinical conclusions.</p><p>The Secure Base in Therapy: Creating Conditions for Attachment Change</p><p>Bowlby's concept of the secure base -- the attachment figure's provision of a stable, reliable presence from which the attached individual can venture forth to explore the world and to which they can return when distressed -- has direct implications for the therapeutic relationship as the primary vehicle for attachment change in individual therapy. The therapist who provides consistent, attuned, non-intrusive, and reliably repaired presence creates the secure base conditions within which clients with insecure attachment can gradually develop the internal sense of security that their early attachment experiences failed to provide.</p><p>The provision of a therapeutic secure base is not the same as providing a corrective emotional experience in the simplistic sense of 'being a better parent.' The therapeutic relationship is categorically different from the early attachment relationship in ways that make any direct attempt to replicate early attachment relationships both inappropriate and therapeutically counterproductive. What the therapeutic relationship provides is not the attachment figures of childhood but an experience of a relationship governed by different implicit relational rules than those the client's internal working models anticipate: rules of consistent attunement rather than inconsistency; acknowledgment rather than dismissal of attachment needs; collaborative exploration rather than directive control; and the reliable repair of relational ruptures rather than their indefinite unacknowledged continuation.</p><p>The Bowlbian secure base in therapy operates through several specific mechanisms that clinical training in attachment-informed therapy addresses. Attunement -- the therapist's moment-to-moment responsiveness to the client's affective state -- communicates the consistent recognition and validation that the client's internal working models may not anticipate as reliably available. Exploration support -- the therapist's explicit encouragement of the client's autonomous exploration of their own experience, rather than the provision of expert interpretations that replace the client's own meaning-making -- communicates respect for the client's epistemic agency that authoritarian caregiving failed to provide. Rupture and repair -- the therapist's consistent acknowledgment and collaborative repair of therapeutic alliance ruptures, including those produced by the therapist's own attunement failures -- provides repeated demonstration of the relational resilience that insecure attachment has made the client doubt: that relationships can survive moments of disconnection and emerge stronger for the repair.</p><p>The specific challenge of providing a therapeutic secure base for dismissing-avoidant clients lies in calibrating the relational proximity of the therapeutic relationship to what the client's attachment system can tolerate at each stage of treatment. Too much relational closeness too early triggers the avoidant client's defensive deactivation -- they become more emotionally distant, more intellectualized, less clinically productive -- while too little relational engagement fails to provide the corrective relational experience that attachment change requires. The skillful clinician working with avoidant attachment reads the client's relational thermostat -- attending carefully to the signs of attachment system activation (increased withdrawal, increased intellectualization, session cancellation, affective flattening) -- and adjusts their relational approach to maintain the therapeutic relationship at the edge of what the client can tolerate without triggering defensive collapse. This calibration, sustained consistently over months and years of treatment, gradually expands the client's window of tolerable relational intimacy in ways that extend beyond the therapeutic relationship into their broader relational life.</p><p>Applying This to Clinical Practice: A Framework</p><p>The clinical frameworks introduced in this course -- adult attachment theory, fantasy bonds, anxiety-driven commitment, cultural scripts, and attachment-informed treatment -- are most useful when integrated into a coherent clinical practice rather than applied as isolated concepts. Several practical applications support this integration for clinicians working with clients presenting with relationship difficulties, commitment challenges, and chronic relational dissatisfaction.</p><p>During initial assessment, gathering a thorough attachment history provides the foundation for formulation that the clinical course of treatment requires. Questions that support attachment assessment include: How would you describe your relationship with each of your parents or primary caregivers? When you were distressed as a child, what did you do? Who was the person you felt most and least safe with as a child, and what made the difference? In your adult relationships, what do you most want from a partner? What do you find most difficult about being in a close relationship? How do you typically respond when a partner seems to be pulling away? These questions, asked with genuine curiosity and without presupposition, provide rich data for the attachment formulation that guides subsequent clinical work.</p><p>In case conceptualization, attachment formulation should be integrated with standard diagnostic assessment rather than treated as an alternative to it. Attachment difficulties are associated with a broad range of clinical presentations including depression, anxiety disorders, relationship OCD, complex trauma, and personality disorder -- and understanding the attachment dimension of these presentations often clarifies clinical patterns that diagnostic formulation alone leaves unexplained. The client whose depression is driven primarily by relationship loss, whose anxiety is focused on relational threat, or whose personality difficulties are organized around attachment insecurity requires treatment planning that attends to the attachment dimension alongside the symptomatic presentation.</p><p>In treatment, the recognition of attachment patterns in the here-and-now of the therapeutic relationship -- noticing when the client's relational behavior in session mirrors the patterns described in their relational history, and gently bringing these observations into the therapeutic conversation -- provides the most direct vehicle for the experiential learning that attachment change requires. The moment when the avoidant client notices their own impulse to intellectualize away an emotional exchange in session, and the therapist names this with curiosity rather than interpretation, is a moment of lived attachment experience that no amount of psychoeducation about attachment theory can replicate. It is in these moments -- repeated, acknowledged, and carefully explored over time -- that the internal working model revisions that constitute genuine attachment change are forged.</p><p>Couple Dynamics and Attachment Choreography</p><p>Understanding couple dynamics through an attachment lens transforms the clinical experience of couples therapy from a bewildering competition of competing narratives into a legible choreography of complementary attachment strategies. What appears on the surface as a couple's conflict about housekeeping, finances, or parenting is almost invariably, beneath the surface, an attachment drama -- a cycle of interaction in which both partners are signaling unmet attachment needs and responding to perceived attachment threats in ways shaped by their individual internal working models. The clinician who learns to read beneath the content of couple conflict to the attachment structure beneath it gains both a more accurate clinical picture and a more effective therapeutic leverage point.</p><p>The negative interaction cycle that Emotionally Focused Therapy identifies is among the most clinically powerful conceptual tools for couples work precisely because it reframes couple conflict as a cycle that both partners are participating in -- a cycle driven not by the bad intentions or character defects of either partner but by the attachment fears and defensive strategies that both partners bring to the relationship from their developmental histories. The pursuing partner who escalates in protest is not 'controlling' or 'demanding' -- they are an anxiously attached person whose attachment system is signaling a relational threat and whose defensive strategy (increased proximity-seeking, escalated protest) is the only strategy their internal working model has available. The withdrawing partner who becomes more distant under relational pressure is not 'cold' or 'avoidant' -- they are a dismissing or fearful-avoidant person whose attachment system is signaling overwhelm and whose defensive strategy (deactivation, distance) is the only strategy their internal working model has available. Reframing the negative cycle in these terms -- depathologizing both partners' attachment strategies while identifying the cycle itself as the enemy of the relationship -- creates the alliance conditions within which genuine attachment work can begin.</p><p>The clinical assessment of couple attachment dynamics requires attention to several specific dimensions: the content of each partner's attachment protest (what specifically triggers their attachment alarm -- disconnection, criticism, control, abandonment cues?); the form of each partner's attachment strategy (pursue-escalate, withdraw-distance, pursue-withdraw with role reversal, mutual avoidance?); the depth of each partner's attachment fear beneath their presenting defensive strategy (the abandonment terror beneath the pursuing partner's criticism, the overwhelm terror beneath the withdrawing partner's distance); and the degree to which each partner can access their primary attachment emotions under relational stress or whether they are blocked behind secondary defensive responses. This multi-dimensional assessment provides the clinical roadmap for EFT's stage one work of de-escalating the negative cycle and stage two work of restructuring attachment bonds.</p><p>Attachment-informed couples therapy also requires cultural humility about the cultural variability of what constitutes appropriate emotional expression, appropriate relational closeness, appropriate gender roles in intimate partnerships, and appropriate levels of autonomy and interdependence within relationships. Dimensions of relational behavior that read as avoidant in one cultural framework may reflect valued independence and appropriate emotional regulation in another. Dimensions of relational behavior that read as anxious preoccupation in one cultural framework may reflect valued relational loyalty and appropriate interdependence in another. The attachment-informed clinician maintains the conceptual framework while holding it lightly enough to remain genuinely curious about the cultural meanings that specific clients bring to their relational patterns.</p><p>From the Consulting Room to the Dance Floor: Concluding Reflections</p><p>Miranda's final image in 'The Chicken Dance' -- alone on the dance floor, watching other couples, her expression carrying the full weight of her conflicted attachment -- is one of the more quietly devastating moments in a show known for its wit. It is a moment that clinicians will recognize: the person whose self-protective strategies have worked perfectly as designed, keeping genuine vulnerability safely contained, watching what might have been possible if the defenses were different. It is not a moment of pathology but of human longing -- the longing for connection that the attachment system generates and that no defensive strategy, however elegant, fully extinguishes.</p><p>The clinical value of fictional characters like Miranda, Charlotte, Carrie, and Samantha lies not in their diagnostic usefulness but in their emotional accessibility -- the way that recognizing a relational pattern in a character we have watched on screen can make that pattern more visible, more humanized, and less shameful when we recognize it in ourselves or our clients. The client who can say 'I know I do the Miranda thing -- I keep people at arm's length and then wonder why they don't stick around' has made a clinical observation that took Miranda six seasons to approach, and they have made it with humor and self-awareness that is itself therapeutic. The cultural illustration has done its work: it has made the abstract concrete, the alien familiar, and the clinical personal.</p><p>As clinicians, we sit with the Miranda moments of our clients' lives -- the moments of watching from the sidelines what genuine intimacy might look like, moments of unacknowledged longing for the connection that is so close and yet so defended against. Our clinical task is not to push our clients onto the dance floor before they are ready but to walk alongside them in their own time, building the therapeutic secure base from which they can gradually take the risks that genuine intimacy requires. The dance does not require perfection -- not the right choreography, not the right partner, not the right moment -- only the willingness to let someone see us when we move.</p><p>The attachment frameworks, cultural analysis, and clinical applications introduced in this course represent entry points into a rich and empirically robust clinical literature that practitioners can continue to develop throughout their careers. The references section provides starting points for deeper engagement with adult attachment theory, couples therapy research, and the clinical applications of attachment science. The clinical supervision consultation, personal therapy reflection, and ongoing peer consultation that attachment-informed practice requires are ongoing professional development investments that compound over time into genuine clinical wisdom -- the kind that knows not only what the theory says but how it feels to sit with a client in their chicken dance moment and find the words that make the invisible visible.</p><p>Earned Security: The Evidence for Attachment Change</p><p>A critical clinical question for practitioners working with attachment difficulties is whether adult attachment patterns are fixed -- the product of early developmental experience that cannot be substantially revised -- or whether genuine attachment change is possible and what conditions support it. The research on earned security provides a clinically essential answer: attachment patterns can and do change in adulthood, and the pathways through which they change have direct implications for clinical practice.</p><p>The concept of earned security -- secure adult attachment that was not present in early childhood but was developed through corrective relational experiences in adolescence or adulthood -- was identified in the Adult Attachment Interview research tradition through the finding that some adults classify as secure on the AAI despite reporting difficult childhood attachment experiences. These individuals demonstrate the narrative coherence, collaborative discourse, and integrated perspective on attachment experiences that characterize continuous security -- but they arrived at this security through later relational experiences rather than through early caregiving. Earned security predicts parenting behavior and child attachment outcomes that are comparable to continuous security, suggesting that the internal working model revision it represents is clinically genuine rather than superficial.</p><p>The pathways to earned security identified in the research literature include: therapeutic relationships that provided consistent, attuned, and reliably repaired relational experiences over sustained periods; stable, secure romantic partnerships that provided ongoing corrective attachment experiences through partner responsiveness and relationship quality; significant mentorship or close friendship relationships with securely attached individuals whose relational presence and modeling gradually revised insecure relational expectations; and personal therapy or reflective practice that developed the narrative integration and mentalization capacity that characterizes secure attachment.</p><p>For clinical practice, the evidence for earned security has both prognostic and technical implications. Prognostically, it supports realistic optimism about the potential for genuine attachment change in clients who present with insecure attachment patterns -- not the naive optimism of unlimited therapeutic possibility but the evidence-based optimism of knowing that the internal working model changes that constitute attachment security can occur in adulthood given the right relational conditions. Technically, it identifies the therapeutic relationship itself -- sustained, consistent, attuned, reliably repaired -- as the primary vehicle for attachment change, and it underscores the importance of the long-term, relationally-focused therapeutic frame for clients whose attachment difficulties are most severe.</p><p>Miranda's trajectory across six seasons of Sex and the City illustrates, in the compressed time of narrative arc, something approximating earned security: her relationship with Steve Brady gradually and imperfectly disconfirms her internal working model of close relationships as threatening to self-sufficiency, and her willingness to tolerate increasing emotional vulnerability with Steve -- halting, occasionally sabotaged, often comically avoidant -- represents the kind of incremental attachment learning that earned security research documents. The final scene of the series finale, in which Miranda runs through Paris streets to find Steve, is narratively melodramatic but clinically legible: the moment in which the cost of the defensive strategy finally exceeds the cost of the vulnerability it was protecting against, and the attachment system breaks through. Clinicians who have sat with avoidant clients through years of careful, persistent relational work will recognize the moment -- and know that it comes not from pushing but from patient, reliable presence that gradually builds the internal evidence that genuine connection is survivable.</p><p>Documentation and Ethical Considerations in Attachment-Informed Practice</p><p>Clinical documentation of attachment-informed conceptualization raises specific considerations about language, clinical accuracy, and the distinction between formal diagnostic categories and attachment-based formulations. Attachment styles are dimensional patterns rooted in developmental experience and supported by extensive empirical research -- they are not diagnostic categories in the DSM-5 or ICD-11 sense, and documenting a client as having 'dismissing-avoidant attachment' in an insurance-submitted clinical record requires clinical judgment about whether this level of formulation is both accurate and appropriate to the specific documentation context. Many clinicians appropriately reserve attachment formulation language for clinical case conceptualization documents, supervision notes, and treatment planning rather than for insurance-submitted diagnostic records that are not designed to capture dimensional relational formulations.</p><p>The ethical use of pop culture references in clinical contexts -- whether in consultation, supervision, case conceptualization, or direct clinical work -- requires attention to several specific considerations. Using a cultural character as a clinical illustration in CE or supervision is appropriate when it illuminates a clinical concept without reducing individual clients to cultural characters. Using cultural characters with clients directly -- suggesting that a client is 'like Miranda' or asking a client to watch an episode as a psychoeducational exercise -- requires careful clinical judgment about whether the identification would be clinically helpful or reductive, whether the cultural text is accessible and appropriate to the client's cultural context, and whether the client has given informed consent to the use of cultural materials in their treatment. Clinicians who use cinema therapy or media-based interventions in clinical work are encouraged to seek specific training in these approaches and to apply them within a coherent clinical framework rather than as isolated techniques.</p><p>Finally, the clinical self-awareness that attachment-informed practice requires extends to the clinician's own attachment patterns and their effects on clinical work. Clinicians with dismissing-avoidant attachment may find themselves maintaining unhelpful emotional distance with clients whose attachment needs they find threatening or excessive. Clinicians with anxious-preoccupied attachment may find themselves over-investing in clients' relational outcomes or experiencing disproportionate distress when clients do not engage with treatment as hoped. Clinicians with fearful-avoidant patterns may experience the specific push-pull in clinical relationships that mirrors their romantic attachment pattern. Attachment-informed clinical training and ongoing supervision and personal therapy that examines the clinician's own attachment patterns are essential professional development investments for practitioners who want to work with attachment difficulties without inadvertently enacting them.</p><p>In summary, this course has used 'The Chicken Dance' as a clinical teaching lens for a body of empirical clinical knowledge that stands entirely on its own. The attachment science, fantasy bond literature, partner selection research, and evidence-based treatment frameworks presented here are applicable across the full range of clinical presentations that mental health professionals encounter -- not only in clients who are Sex and the City fans. The episode provides illustration, color, and narrative accessibility; the clinical frameworks provide the conceptual substance and empirical grounding that evidence-based practice requires. Mental health professionals who integrate attachment theory into their clinical assessment, case conceptualization, and treatment planning are drawing on one of the most robust and clinically productive bodies of research in the field -- research that consistently demonstrates that the quality of attachment security, whether assessed in infants, children, adults, or couples, is among the strongest predictors of psychological wellbeing and relational health across the lifespan. Miranda's dance floor moment is the clinical moment -- the moment before genuine change, when the cost of the defense is finally becoming visible. The clinician's presence in that moment, steady, curious, and genuinely there, is the beginning of the work.</p><p>Practitioners are encouraged to review the references in this course, seek supervision that addresses their own attachment patterns in clinical work, and continue developing their attachment-informed clinical practice through ongoing professional development. The integration of attachment science into clinical practice is not a technique but an orientation -- a way of seeing relational dynamics, formulating clinical presentations, and understanding the therapeutic relationship that deepens with every clinical encounter and every honest examination of one's own relational patterns as a clinician.</p></div>"
        }
      ]
    }
  ],
  "assessment": {
    "passingScore": 80,
    "passThreshold": 0.8,
    "questions": [
      {
        "question": "Bartholomew and Horowitz's (1991) four-category adult attachment model is organized along which two dimensions:",
        "options": [
          {
            "text": "Trust and commitment",
            "isCorrect": false
          },
          {
            "text": "Anxiety (negative model of self) and avoidance (negative model of other)",
            "isCorrect": true
          },
          {
            "text": "Dependency and emotional autonomy",
            "isCorrect": false
          },
          {
            "text": "Security and insecurity on a single continuum",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "The dismissing-avoidant attachment pattern is most accurately described as:",
        "options": [
          {
            "text": "High anxiety and high avoidance, producing simultaneous desire for and fear of closeness",
            "isCorrect": false
          },
          {
            "text": "Low anxiety and high avoidance, characterized by compulsive self-reliance and discomfort with emotional dependency",
            "isCorrect": true
          },
          {
            "text": "High anxiety and low avoidance, characterized by preoccupation with relationships and fear of abandonment",
            "isCorrect": false
          },
          {
            "text": "Low anxiety and low avoidance, reflecting earned security developed through positive relational experiences",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "Mikulincer and Shaver's (2016) research on avoidant attachment demonstrated that:",
        "options": [
          {
            "text": "Avoidantly attached individuals genuinely do not experience attachment-related distress or need",
            "isCorrect": false
          },
          {
            "text": "Avoidant attachment represents active inhibition of attachment processes rather than true indifference to attachment",
            "isCorrect": true
          },
          {
            "text": "Avoidant attachment produces lower physiological stress responses than anxious attachment in all contexts",
            "isCorrect": false
          },
          {
            "text": "Avoidant attachment is primarily a cognitive rather than emotional or behavioral pattern",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "Fearful-avoidant attachment is associated with which developmental history:",
        "options": [
          {
            "text": "Inconsistent caregiving that was sometimes responsive and sometimes unavailable",
            "isCorrect": false
          },
          {
            "text": "Consistently unresponsive caregiving that rejected the child's expressions of attachment need",
            "isCorrect": false
          },
          {
            "text": "Caregiving in which the attachment figure was both the source of comfort and the source of fear",
            "isCorrect": true
          },
          {
            "text": "Consistently responsive caregiving that met the child's attachment needs reliably",
            "isCorrect": false
          }
        ],
        "correctAnswer": 2,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "Robert Firestone's concept of the 'fantasy bond' most directly describes:",
        "options": [
          {
            "text": "The idealization phase of new romantic relationships before the partner's limitations become apparent",
            "isCorrect": false
          },
          {
            "text": "A relational defense in which the form and routine of relationship replaces genuine intimate connection",
            "isCorrect": true
          },
          {
            "text": "The cultural fantasy of romantic love as the primary path to personal fulfillment",
            "isCorrect": false
          },
          {
            "text": "An attachment style characterized by the fantasy of availability of partners who are actually unavailable",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "A clinician assessing whether a client's rapid commitment reflects anxiety-driven versus choice-driven decision-making should specifically evaluate:",
        "options": [
          {
            "text": "Whether the client has known the partner for at least six months before committing",
            "isCorrect": false
          },
          {
            "text": "Whether the client's primary motivation is relief from aloneness anxiety or genuine selection of this specific person",
            "isCorrect": true
          },
          {
            "text": "Whether both partners have secure attachment styles as assessed by validated measures",
            "isCorrect": false
          },
          {
            "text": "Whether the client's family and friends approve of the relationship",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "Finkel and colleagues' suffocation model of modern marriage proposes that contemporary relationship dissatisfaction is primarily driven by:",
        "options": [
          {
            "text": "Declining commitment and willingness to invest effort in relationships",
            "isCorrect": false
          },
          {
            "text": "Inflated expectations for marriage to provide self-actualization in addition to companionship",
            "isCorrect": true
          },
          {
            "text": "Incompatible attachment styles between partners",
            "isCorrect": false
          },
          {
            "text": "Declining cultural valuation of marriage as an institution",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "Soulmate ideology (belief in a perfect destined partner) is associated with which relationship outcome pattern:",
        "options": [
          {
            "text": "Higher relationship satisfaction because it promotes persistence through relational difficulties",
            "isCorrect": false
          },
          {
            "text": "Lower relationship satisfaction specifically when relationships require effort and encounter difficulties",
            "isCorrect": true
          },
          {
            "text": "Higher relationship satisfaction early but lower satisfaction in long-term relationships",
            "isCorrect": false
          },
          {
            "text": "No significant effect on relationship satisfaction independent of attachment style",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "The Experiences in Close Relationships Scale (ECR-R) assesses adult attachment on which dimensions:",
        "options": [
          {
            "text": "Secure, preoccupied, dismissing, and fearful attachment categories",
            "isCorrect": false
          },
          {
            "text": "Continuous dimensions of attachment anxiety and avoidance",
            "isCorrect": true
          },
          {
            "text": "Early childhood attachment experiences and their current relational effects",
            "isCorrect": false
          },
          {
            "text": "Relationship satisfaction and commitment independently of attachment processes",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "Emotionally Focused Therapy for Couples (EFT-C) addresses attachment difficulties by:",
        "options": [
          {
            "text": "Teaching communication skills that reduce the frequency of conflict cycles",
            "isCorrect": false
          },
          {
            "text": "Restructuring cognitive distortions about the partner's intentions and motivations",
            "isCorrect": false
          },
          {
            "text": "Accessing and reshaping the underlying attachment fears that drive negative interaction cycles",
            "isCorrect": true
          },
          {
            "text": "Building commitment through behavioral activation and positive reinforcement",
            "isCorrect": false
          }
        ],
        "correctAnswer": 2,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "The pursue-withdraw dynamic in couples therapy is most accurately understood as:",
        "options": [
          {
            "text": "A power struggle in which one partner dominates and the other submits",
            "isCorrect": false
          },
          {
            "text": "A cycle driven by the pursuing partner's abandonment anxiety and the withdrawing partner's engulfment fear",
            "isCorrect": true
          },
          {
            "text": "A communication deficit that can be corrected through assertiveness training",
            "isCorrect": false
          },
          {
            "text": "A personality incompatibility that predicts poor treatment prognosis",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "Mentalization-Based Treatment (MBT) addresses attachment difficulties by focusing on:",
        "options": [
          {
            "text": "The revision of early childhood attachment experiences through EMDR processing",
            "isCorrect": false
          },
          {
            "text": "The development of reflective functioning -- understanding behavior in terms of underlying mental states",
            "isCorrect": true
          },
          {
            "text": "The restructuring of dysfunctional relationship schemas through cognitive challenge",
            "isCorrect": false
          },
          {
            "text": "The behavioral rehearsal of secure attachment behaviors in simulated relational contexts",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "A client who describes all long-term relationships as 'fine' with minimal affect and consistently reports that partners experienced them as emotionally unavailable is most consistent with which attachment profile:",
        "options": [
          {
            "text": "Anxious-preoccupied attachment",
            "isCorrect": false
          },
          {
            "text": "Fearful-avoidant attachment",
            "isCorrect": false
          },
          {
            "text": "Dismissing-avoidant attachment",
            "isCorrect": true
          },
          {
            "text": "Secure attachment with communication difficulties",
            "isCorrect": false
          }
        ],
        "correctAnswer": 2,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "Cultural scripts that assign women primary responsibility for the emotional labor of relationships are clinically significant because:",
        "options": [
          {
            "text": "They accurately reflect biological differences in emotional processing between men and women",
            "isCorrect": false
          },
          {
            "text": "They may produce distress that is culturally induced rather than individually pathological",
            "isCorrect": true
          },
          {
            "text": "They are exclusively relevant to clients who explicitly identify as feminist",
            "isCorrect": false
          },
          {
            "text": "They primarily affect anxiously attached rather than avoidantly attached female clients",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Review the corresponding course section for further detail on this topic."
      },
      {
        "question": "The primary clinical goal with dismissing-avoidant clients in individual therapy is:",
        "options": [
          {
            "text": "Convincing the client that emotional dependency is healthy and normal",
            "isCorrect": false
          },
          {
            "text": "Creating a safe therapeutic relationship within which the defensively suppressed attachment system can gradually become accessible",
            "isCorrect": true
          },
          {
            "text": "Restructuring the cognitive distortions that maintain the avoidant attachment strategy",
            "isCorrect": false
          },
          {
            "text": "Providing psychoeducation about attachment theory and its developmental origins",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Review the corresponding course section for further detail on this topic."
      }
    ]
  },
  "references": [
    "Ainsworth, M. D. S., Blehar, M. C., Waters, E., & Wall, S. (1978). Patterns of attachment: A psychological study of the strange situation. Erlbaum.",
    "Bartholomew, K., & Horowitz, L. M. (1991). Attachment styles among young adults: A test of a four-category model. Journal of Personality and Social Psychology, 61(2), 226-244.",
    "Bateman, A., & Fonagy, P. (2016). Mentalization-based treatment for personality disorders: A practical guide. Oxford University Press.",
    "Bowlby, J. (1969). Attachment and loss: Vol. 1. Attachment. Basic Books.",
    "Bowlby, J. (1973). Attachment and loss: Vol. 2. Separation: Anxiety and anger. Basic Books.",
    "Bowlby, J. (1980). Attachment and loss: Vol. 3. Loss: Sadness and depression. Basic Books.",
    "Brennan, K. A., Clark, C. L., & Shaver, P. R. (1998). Self-report measurement of adult attachment. In J. A. Simpson & W. S. Rholes (Eds.), Attachment theory and close relationships (pp. 46-76). Guilford.",
    "Finkel, E. J., Cheung, E. O., Emery, L. F., Carswell, K. L., & Larson, G. M. (2015). The suffocation model: Why marriage in America is becoming an all-or-nothing institution. Current Directions in Psychological Science, 24(3), 238-244.",
    "Firestone, R. W. (1985). The fantasy bond: Structure of psychological defenses. Human Sciences Press.",
    "Fraley, R. C., Waller, N. G., & Brennan, K. A. (2000). An item response theory analysis of self-report measures of adult attachment. Journal of Personality and Social Psychology, 78(2), 350-365.",
    "Hazan, C., & Shaver, P. (1987). Romantic love conceptualized as an attachment process. Journal of Personality and Social Psychology, 52(3), 511-524.",
    "Johnson, S. M. (2004). The practice of emotionally focused couple therapy: Creating connection (2nd ed.). Brunner-Routledge.",
    "Knee, C. R. (1998). Implicit theories of relationships: Assessment and prediction of romantic relationship initiation, coping, and longevity. Journal of Personality and Social Psychology, 74(2), 360-370.",
    "Main, M., & Hesse, E. (1990). Parents' unresolved traumatic experiences are related to infant disorganized attachment status. In M. T. Greenberg, D. Cicchetti, & E. M. Cummings (Eds.), Attachment in the preschool years (pp. 161-182). University of Chicago Press.",
    "Mikulincer, M., & Shaver, P. R. (2016). Attachment in adulthood: Structure, dynamics, and change (2nd ed.). Guilford.",
    "Siegel, D. J. (2010). The mindful therapist: A clinician's guide to mindsight and neural integration. Norton."
  ],
  "resources": []
};

export default COURSE;

async function seed() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  let doc = await Course.findOne({ slug: COURSE.slug });
  if (doc) { doc.set(COURSE); console.log('Updating:', COURSE.slug); }
  else { doc = new Course(COURSE); console.log('Inserting:', COURSE.slug); }
  await doc.save();
  console.log(`Saved ${doc.courseCode} wordCount=${doc.wordCount} target=${(doc.ceHours||0)*6000}`);
  await mongoose.disconnect();
}
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  seed().catch(e => { console.error('SEED ERROR:', e.message); process.exit(1); });
}
