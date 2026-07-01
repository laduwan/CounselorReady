/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Palette, Users, CreditCard, Globe, Mail, BarChart3, Upload,
  Rocket, ChevronDown, ChevronUp, Lightbulb, ArrowRight, CheckCircle2, AlertTriangle
} from 'lucide-react';

const BURGUNDY = '#6B1D34';
const BURGUNDY_LIGHT = '#fdf5f6';
const HUNTER = '#4A7C59';

const SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Rocket,
    content: [
      {
        heading: 'Welcome to Your Partner Portal',
        body: `As a CounselorReady partner, you can build and sell your own CE courses, manage your user base, and run your training platform under your own brand. This manual walks you through every feature and shares best practices so you can get the most out of your partnership.`
      },
      {
        heading: 'Onboarding Checklist',
        body: `When you first log in, you'll see the Getting Started page with a progress tracker. Complete these steps in order:`,
        steps: [
          'Set up your branding (logo, colors, company name)',
          'Create your first course',
          'Invite your first users',
          'Choose a billing plan',
          'Set up a custom domain (Professional+ plans)'
        ]
      },
      {
        heading: 'Your Dashboard',
        body: `Your Partner Dashboard (/partner-dashboard) is your home base. It shows at-a-glance stats including total users, active users, courses completed, and CE hours earned. You'll also see your registration link here — share this with prospective users so they sign up under your organization.`
      }
    ],
    bestPractices: [
      'Complete all onboarding steps before inviting users — first impressions matter.',
      'Copy your partner registration link and test it yourself to see what new users experience.',
      'Bookmark your dashboard — check it weekly to track growth.'
    ]
  },
  {
    id: 'courses',
    title: 'Creating & Managing Courses',
    icon: BookOpen,
    content: [
      {
        heading: 'Course Admin',
        body: `Navigate to Course Admin (/partner/courses) to create, edit, and manage your courses. Each course needs a title, description, and CE hours. Courses start in "draft" status — publish them when they're ready for your users.`
      },
      {
        heading: 'Creating a Course',
        body: `Click "Create Course" and fill in the required fields:`,
        steps: [
          'Title — Keep it clear and specific (e.g., "Trauma-Informed Care for School Counselors")',
          'Description — Explain what learners will gain. This appears in your catalog.',
          'CE Hours — Set the continuing education credit hours. Be accurate to your accrediting body\'s requirements.',
          'Categories — Tag courses by topic area for easier filtering.',
          'Learning Objectives — Required for ACEP compliance. List 2-5 measurable objectives.'
        ]
      },
      {
        heading: 'Course Lifecycle',
        body: `Courses follow a simple lifecycle: Draft → Published → Archived. Toggle between draft and published from the Course Admin page. Only published courses appear in your catalog. Archive courses you no longer want to offer.`
      },
      {
        heading: 'Shared Platform Courses',
        body: `Your users also have access to CounselorReady's shared course catalog. These platform courses appear alongside your own in the catalog. Think of these as a value-add — they give your users more options while your own courses remain the primary offering.`
      },
      {
        heading: 'Bulk Upload',
        body: `If you have many courses to add, use Bulk Upload (/partner/bulk-upload). Download the JSON or CSV template, fill in your course data, and upload. Each course in the batch is validated before creation. This is available on Growth plans and above.`
      }
    ],
    bestPractices: [
      'Quality over quantity — one excellent course builds more trust than ten mediocre ones.',
      'Write clear learning objectives. They help learners decide and satisfy accreditation requirements.',
      'Keep course titles under 60 characters so they display well on all devices.',
      'Start with 2-3 courses, gauge completion rates, then expand based on what works.',
      'Use the bulk upload template format even for manual entry — it helps you stay consistent.',
      'Review courses quarterly. Update content, fix any issues, and archive outdated material.',
      'Set CE hours accurately — overstating hours erodes credibility with licensing boards.'
    ]
  },
  {
    id: 'branding',
    title: 'Branding & Customization',
    icon: Palette,
    content: [
      {
        heading: 'Brand Settings',
        body: `Navigate to Branding (/partner/branding) to customize how your platform looks. Your branding applies to the course catalog, registration page, and all user-facing pages when users access through your partner link.`
      },
      {
        heading: 'Available Options',
        steps: [
          'Company Name — Displayed in the header, emails, and certificates',
          'Tagline — Short description shown under your company name',
          'Logo URL — Link to your logo image (recommended: square, at least 200x200px)',
          'Color Scheme — Choose from 15+ preset schemes (Sky Blue, Navy, Charcoal, Olive, etc.) or set custom brand colors',
          'Primary Color — Your main brand color for buttons, headers, and accents',
          'Accent Color — Secondary color for highlights and badges'
        ]
      },
      {
        heading: 'Color Schemes',
        body: `We provide preset color schemes that are professionally designed and accessibility-tested. Choose one that matches your brand, or select "Custom Colors" to enter exact hex values. The preview panel shows you how your choices look before saving.`
      }
    ],
    bestPractices: [
      'Use your actual brand colors — consistency builds trust with your users.',
      'Upload a high-quality logo. Blurry or low-res logos look unprofessional.',
      'Test your color scheme on mobile. Some colors that look good on desktop may be hard to read on smaller screens.',
      'Keep your tagline short (under 10 words). It\'s a headline, not a paragraph.',
      'Stick with preset color schemes if you\'re unsure — they\'re designed to be accessible.'
    ]
  },
  {
    id: 'users',
    title: 'User Management',
    icon: Users,
    content: [
      {
        heading: 'Managing Your Users',
        body: `The Users page (/partner/users) shows everyone registered under your organization. You can search, invite new users, and remove users who should no longer have access.`
      },
      {
        heading: 'Inviting Users',
        body: `There are two ways to bring users in:`,
        steps: [
          'Registration Link — Share your partner link (yourdomain.com/register?partner=your-slug). Anyone who signs up through it is automatically associated with your organization.',
          'Email Invitations — From the Users page, enter one or more email addresses (comma or newline separated). Users receive a branded welcome email with a link to create their account.'
        ]
      },
      {
        heading: 'User Limits',
        body: `Your plan determines the maximum number of users. Starter allows 100 users, Growth allows 500, Professional allows 5,000, and Enterprise is unlimited. You can see your current usage on the Reports page.`
      },
      {
        heading: 'Removing Users',
        body: `You can remove a user from your organization. This doesn't delete their CounselorReady account — it unlinks them from your organization so they no longer see your courses. Their completion records are preserved.`
      }
    ],
    bestPractices: [
      'Use email invitations for targeted outreach — they feel more personal than a generic link.',
      'Send invitations in small batches (10-20) rather than hundreds at once.',
      'Include a personal note when sharing your registration link ("I\'ve set up CE courses for our team...").',
      'Monitor your user count relative to your plan limit. Upgrade before you hit the cap to avoid disrupting registrations.',
      'Remove inactive users periodically to keep your roster clean and your analytics accurate.'
    ]
  },
  {
    id: 'emails',
    title: 'Email Templates',
    icon: Mail,
    content: [
      {
        heading: 'Customizing Emails',
        body: `Navigate to Email Templates (/partner/email-templates) to customize the emails your users receive. Your brand colors and company name are automatically applied to the email header and footer.`
      },
      {
        heading: 'Template Types',
        steps: [
          'Welcome Email — Sent when a user registers through your partner link',
          'Invitation Email — Sent when you invite users from the Users page',
          'Course Completion — Sent when a user completes one of your courses'
        ]
      },
      {
        heading: 'What You Can Customize',
        body: `For each template, you can edit the subject line and body text. Keep the placeholders (like {{name}}, {{courseName}}) intact — they get replaced with actual values when the email is sent. Use the Preview button to see how each email will look.`
      }
    ],
    bestPractices: [
      'Personalize the welcome email — a warm first email sets the tone for the whole relationship.',
      'Keep email subjects under 50 characters so they don\'t get cut off on mobile.',
      'Include a clear call to action in every email (e.g., "Start your first course").',
      'Preview every template before saving. Check that placeholders render correctly.',
      'Don\'t over-brand emails with too much marketing — users appreciate straightforward communication.'
    ]
  },
  {
    id: 'billing',
    title: 'Plans & Billing',
    icon: CreditCard,
    content: [
      {
        heading: 'Choosing a Plan',
        body: `Navigate to Billing (/partner/billing) to view plans, upgrade, or manage your subscription. All billing is handled securely through Stripe.`
      },
      {
        heading: 'Plan Comparison',
        table: {
          headers: ['Feature', 'Starter ($99/mo)', 'Growth ($199/mo)', 'Professional ($399/mo)', 'Enterprise ($799/mo)'],
          rows: [
            ['Courses', '10', '50', '200', 'Unlimited'],
            ['Users', '100', '500', '5,000', 'Unlimited'],
            ['Bulk Upload', 'No', 'Yes', 'Yes', 'Yes'],
            ['Custom Domain', 'No', 'No', 'Yes', 'Yes'],
            ['Intro Pricing', '$49/mo for 2 months', '$99/mo for 2 months', '—', '—']
          ]
        }
      },
      {
        heading: 'Managing Your Subscription',
        body: `Once subscribed, you can manage your subscription through the Stripe billing portal — update payment methods, download invoices, or change plans. Click "Manage Subscription" on the Billing page to access it.`
      }
    ],
    bestPractices: [
      'Start with Starter if you have fewer than 10 courses and fewer than 100 users.',
      'Take advantage of intro pricing — Starter and Growth plans offer 50% off for the first 2 months.',
      'Upgrade before you hit your limits. Hitting a course or user cap blocks new additions.',
      'If you\'re unsure which plan you need, start small and upgrade as you grow. Upgrades are instant.',
      'Download your invoices monthly for tax and accounting purposes.'
    ]
  },
  {
    id: 'domain',
    title: 'Custom Domain',
    icon: Globe,
    content: [
      {
        heading: 'Setting Up Your Domain',
        body: `Professional and Enterprise partners can connect a custom domain (e.g., training.yourcompany.com) so your platform runs entirely under your own URL. Navigate to Custom Domain (/partner/domain) to set this up.`
      },
      {
        heading: 'Setup Steps',
        steps: [
          'Enter your desired domain (e.g., ce.yourpractice.com)',
          'Save the domain to get your DNS verification records',
          'Add the provided CNAME or TXT record to your domain\'s DNS settings',
          'Click "Verify" — DNS changes can take up to 48 hours to propagate',
          'Once verified, your platform is accessible at your custom domain'
        ]
      },
      {
        heading: 'DNS Configuration',
        body: `You'll receive specific DNS records to add. If you're not sure how to update DNS, contact your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) — they all have documentation for adding CNAME records.`
      }
    ],
    bestPractices: [
      'Use a subdomain (training.yoursite.com) rather than a root domain for easier setup.',
      'Set up your domain AFTER branding is finalized — the domain serves your branded experience.',
      'Allow 24-48 hours for DNS propagation. Don\'t worry if verification fails immediately.',
      'Test the domain in an incognito browser window after verification to confirm it works.',
      'If you use Cloudflare, set the DNS record to "DNS Only" (gray cloud) mode initially.'
    ]
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    icon: BarChart3,
    content: [
      {
        heading: 'Available Reports',
        body: `The Reports page (/partner/reports) provides downloadable CSV reports and shows your quota usage at a glance.`
      },
      {
        heading: 'Report Types',
        steps: [
          'Users Report — All registered users with name, email, signup date, and subscription status',
          'Courses Report — Your courses with enrollment counts, completion counts, and status',
          'Completions Report — Detailed completion records: who completed what, when, and CE hours awarded'
        ]
      },
      {
        heading: 'Quota Dashboard',
        body: `The top of the Reports page shows your current usage vs. plan limits for courses and users. Keep an eye on these numbers as you approach your limits.`
      },
      {
        heading: 'Using Report Data',
        body: `Download reports as CSV files that open in Excel, Google Sheets, or any spreadsheet tool. Use them to track progress, identify drop-offs, and report to stakeholders.`
      }
    ],
    bestPractices: [
      'Download a completions report monthly for your records and accreditation compliance.',
      'Track your completion rate (completions / enrollments). Below 40% may indicate course design issues.',
      'Use the users report to identify inactive users who might benefit from a follow-up email.',
      'Share course performance summaries with your team to inform which courses to build next.',
      'Export reports before plan changes — they reflect your data at that point in time.'
    ]
  },
  {
    id: 'growth',
    title: 'Growing Your Business',
    icon: Lightbulb,
    content: [
      {
        heading: 'Marketing Your Courses',
        body: `Your success depends on getting the right people into the right courses. Here are proven strategies for growing your partner platform.`
      },
      {
        heading: 'Course Strategy',
        steps: [
          'Identify your niche — What unique expertise does your organization bring?',
          'Start with required topics — Ethics, supervision, and mandatory CE topics always have demand.',
          'Create a course pathway — Sequence courses from introductory to advanced to keep users coming back.',
          'Update regularly — Boards value current content. Add revision dates to your courses.',
          'Gather feedback — Ask completers what they want next and build to demand.'
        ]
      },
      {
        heading: 'User Acquisition',
        steps: [
          'Email your existing contacts with your registration link',
          'Add the registration link to your website, email signature, and social profiles',
          'Partner with professional associations to offer CE bundles',
          'Offer your first course free or at reduced CE hours to build trust',
          'Ask satisfied users for referrals — word of mouth is powerful in clinical communities'
        ]
      },
      {
        heading: 'Retention',
        steps: [
          'Send periodic updates about new courses (use your welcome email template as inspiration)',
          'Create course series that build on each other',
          'Track completion rates — low rates may signal content or UX issues',
          'Respond to user questions promptly',
          'Celebrate milestones — acknowledge users who complete multiple courses'
        ]
      }
    ],
    bestPractices: [
      'Focus on quality and reputation first, scale second.',
      'Your completion rate is your most important metric — it reflects course quality and user satisfaction.',
      'Build at least 3-5 courses before heavy marketing. A thin catalog can underwhelm new visitors.',
      'Keep courses between 1-6 CE hours. Very long courses have higher dropout rates.',
      'Set a schedule: launch one new course per month to keep your catalog fresh.',
      'Monitor which courses get the most enrollments and completions — double down on what works.'
    ]
  }
];

function Section({ section, isOpen, onToggle }) {
  const Icon = section.icon;

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-stone-50 transition-colors"
      >
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: BURGUNDY_LIGHT }}>
          <Icon className="w-5 h-5" style={{ color: BURGUNDY }} />
        </div>
        <span className="text-lg font-semibold text-stone-800 flex-1">{section.title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 space-y-6 border-t border-stone-100 pt-4">
          {section.content.map((block, i) => (
            <div key={i}>
              <h3 className="text-base font-semibold text-stone-800 mb-2">{block.heading}</h3>
              {block.body && <p className="text-sm text-stone-600 leading-relaxed mb-3">{block.body}</p>}
              {block.steps && (
                <ol className="space-y-2 ml-1">
                  {block.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-stone-600">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5" style={{ background: BURGUNDY_LIGHT, color: BURGUNDY }}>
                        {j + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
              {block.table && (
                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-sm border border-stone-200 rounded-lg overflow-hidden">
                    <thead>
                      <tr style={{ background: BURGUNDY_LIGHT }}>
                        {block.table.headers.map((h, j) => (
                          <th key={j} className="px-3 py-2 text-left text-xs font-semibold text-stone-600 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {block.table.rows.map((row, j) => (
                        <tr key={j} className="hover:bg-stone-50">
                          {row.map((cell, k) => (
                            <td key={k} className={`px-3 py-2 text-stone-600 whitespace-nowrap ${k === 0 ? 'font-medium' : ''}`}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {section.bestPractices && (
            <div className="rounded-lg p-4 mt-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4" style={{ color: HUNTER }} />
                <span className="text-sm font-semibold" style={{ color: HUNTER }}>Best Practices</span>
              </div>
              <ul className="space-y-2">
                {section.bestPractices.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: HUNTER }} />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PartnerUserManual() {
  const [openSections, setOpenSections] = useState({ 'getting-started': true });

  function toggle(id) {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function expandAll() {
    const all = {};
    SECTIONS.forEach(s => { all[s.id] = true; });
    setOpenSections(all);
  }

  function collapseAll() {
    setOpenSections({});
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: BURGUNDY, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Partner Manual
          </h1>
          <p className="text-sm text-stone-500 mt-1">Everything you need to build and grow your CE course business</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={expandAll} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors">
            Expand All
          </button>
          <button onClick={collapseAll} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors">
            Collapse All
          </button>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Jump to Section</p>
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setOpenSections(prev => ({ ...prev, [s.id]: true }));
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-stone-100 border border-stone-200 text-stone-600"
              >
                <Icon className="w-3.5 h-3.5" />
                {s.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Important Note */}
      <div className="rounded-lg p-4 flex items-start gap-3" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Before You Begin</p>
          <p className="text-sm text-amber-700 mt-1">
            Make sure you've completed the <Link to="/partner/onboarding" className="underline font-medium">Getting Started checklist</Link> first.
            Your branding and at least one published course should be in place before inviting users.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {SECTIONS.map(s => (
          <div key={s.id} id={s.id}>
            <Section section={s} isOpen={!!openSections[s.id]} onToggle={() => toggle(s.id)} />
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 text-center">
        <p className="text-base font-semibold text-stone-800 mb-2">Ready to get started?</p>
        <p className="text-sm text-stone-500 mb-4">Head to your dashboard and start building.</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/partner-dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-lg text-sm font-medium transition-colors"
            style={{ background: BURGUNDY }}
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/partner/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-colors"
            style={{ color: HUNTER, borderColor: HUNTER }}
          >
            <BookOpen className="w-4 h-4" /> Create a Course
          </Link>
        </div>
      </div>
    </div>
  );
}
