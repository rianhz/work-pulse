'use client';

import type { NextPage } from 'next';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

const trustedLeaders = ['Acme Corp', 'Globex', 'Soylent', 'Initech'];

const features = [
  {
    icon: '💬',
    title: 'Real-time Collaboration',
    description:
      'Highlight seamless team communication with integrated chat channels, direct messaging, and file sharing designed for enterprise speed.',
    demo: '💬 [Mock Message Demo]',
  },
  {
    icon: '⏰',
    title: 'Effortless Productivity',
    description:
      'Track hours and projects with zero friction. Automated reminders and easy-to-use interfaces ensure compliance without the headache.',
    demo: '⏰ [Mock Timer Demo]',
  },
  {
    icon: '📊',
    title: 'Visibility at Scale',
    description:
      "Visualize your entire organization's structure and performance. Easily navigate reporting lines and find the right people quickly.",
    demo: '📊 [Mock Org Chart Demo]',
  },
  {
    icon: '🗓️',
    title: 'Automated Workflows',
    description:
      'Streamline requests and approvals with ease. Custom approval chains and real-time balance tracking keep everyone aligned.',
    demo: '🗓️ [Mock Leave Request Demo]',
  },
];

const mockLeaves = [
  {
    name: 'Sarah Jenkins',
    type: 'Annual Leave Request',
    details: 'Aug 15 - Aug 20 • 40 hours',
    status: 'Approved',
    initials: 'SJ',
  },
  {
    name: 'Michael Davis',
    type: 'Sick Leave',
    details: 'Sep 02 - Sep 03 • 16 hours',
    status: 'Pending',
    initials: 'MD',
  },
  {
    name: 'Alex Rivera',
    type: 'Annual Leave',
    details: 'Aug 09 - Aug 09 • 8 hours',
    status: 'Rejected',
    initials: 'AR',
  },
];

// --- Animation Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const LandingPage: NextPage = () => {
  return (
    <div className="min-h-screen font-sans bg-main text-body-color w-full max-w-[1440px] mx-auto overflow-hidden">
      
      {/* --- 1. Top Navbar --- */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center justify-between py-4 border-b border-black/10 md:px-8"
      >
        <div className="text-2xl font-serif font-bold">WP Enterprise</div>
        <nav className="hidden md:flex items-center gap-6">
          {['Features', 'Solutions', 'Pricing'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium hover:opacity-80 transition-opacity"
            >
              {link}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="px-6 py-4"
            asChild
          >
            <Link href="/signin">Login</Link>
          </Button>
          <Button
            className="px-6 py-4"
            asChild
          >
            <Link href="/signup">Signup</Link>
          </Button>
        </div>
      </motion.header>

      {/* --- 2. Hero Section --- */}
      <section className="py-20 text-center flex flex-col items-center px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-serif font-extrabold max-w-3xl mb-4 leading-tight"
          >
            The Operating System for Modern Teams
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl max-w-2xl mb-12 text-body-color"
          >
            Unified Chat, Timesheet management, Team reporting, and Leave approvals
            in one powerful, multi-tenant platform.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
            <Button className="rounded-lg px-8 py-6 btn-primary text-base transition-transform active:scale-95">
              Get Started for Free
            </Button>
            <Button
              variant="outline"
              className="rounded-lg px-8 py-6 btn-outline-brand text-base transition-transform active:scale-95"
            >
              Book a Demo
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* --- 3. Dashboard Image Simulation Section --- */}
      <section className="py-12 flex justify-center bg-accent-band rounded-2xl mb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6 }}
          className="w-full max-w-6xl"
        >
          <Card className="p-2 shadow-2xl bg-white border border-black/10 rounded-xl transition-shadow duration-300">
            <CardContent className="p-0 rounded-lg overflow-hidden aspect-[1.8/1] flex items-center justify-center bg-gray-100 text-gray-500 font-bold">
              <span>[ Dashboard Interface Preview ]</span>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* --- 4. Trusted By --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInUp}
        className="text-center mb-20 px-4"
      >
        <h2 className="text-xs uppercase tracking-widest mb-6 font-semibold opacity-70">
          Trusted by Global Leaders
        </h2>
        <motion.div
          variants={staggerContainer}
          className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-2xl font-serif font-semibold opacity-60"
        >
          {trustedLeaders.map((leader) => (
            <motion.span variants={fadeInUp} key={leader}>
              {leader}
            </motion.span>
          ))}
        </motion.div>
      </motion.section>

      {/* --- 5. Grid Features --- */}
      <section className="py-12 px-4 md:px-8 flex flex-col items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center max-w-2xl mb-16"
        >
          <h2 className="text-4xl font-serif font-extrabold mb-4">
            Everything your team needs
          </h2>
          <p className="text-lg text-body-color">
            Stop switching context. Manage your entire organization's workflow from
            a single, intuitive interface.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="p-8 border border-black/10 bg-white/60 flex flex-col gap-6 rounded-2xl h-full shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{feature.icon}</div>
                    <h3 className="text-2xl font-serif font-bold">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-base text-body-color leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="rounded-xl p-6 h-36 flex items-center justify-center font-medium text-gray-500 border border-dashed border-black/15 bg-accent-band mt-auto">
                    {feature.demo}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- 6. Workflow & Badge Demo --- */}
      <section className="py-16 my-12 flex flex-col items-center bg-accent-band rounded-2xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center max-w-2xl mb-12 px-4"
        >
          <h2 className="text-3xl font-serif font-bold mb-3">
            Automated Workflows
          </h2>
          <p className="text-body-color">
            Streamline requests and approvals with ease. Custom approval chains
            and real-time balance tracking.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl px-4"
        >
          <Card className="bg-white border border-black/10 p-4 rounded-xl shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-black/10">
                  <TableHead className="w-16">User</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeaves.map((leaf, idx) => (
                  <TableRow key={idx} className="border-b border-black/5">
                    <TableCell>
                      <div className="w-10 h-10 rounded-full bg-accent-band flex items-center justify-center font-semibold text-sm">
                        {leaf.initials}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-header-color">
                          {leaf.type}
                        </span>
                        <span className="text-xs text-body-color">
                          {leaf.details}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${
                          leaf.status === 'Approved'
                            ? 'badge-approved'
                            : leaf.status === 'Pending'
                            ? 'badge-pending'
                            : 'badge-rejected'
                        }`}
                      >
                        {leaf.status}
                      </motion.span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </motion.div>
      </section>

      {/* --- 7. Testimonial --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
        className="py-20 text-center flex flex-col items-center px-4"
      >
        <div className="text-6xl mb-6 opacity-30 font-serif">“</div>
        <blockquote className="text-2xl md:text-3xl max-w-4xl mb-8 font-serif font-medium leading-relaxed">
          "Implementing WP Enterprise fundamentally changed how our engineering
          teams operate. The unification of time tracking, leave, and
          communication removed incredible amounts of friction."
        </blockquote>
        <div className="flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-full bg-accent-band flex items-center justify-center font-bold text-sm">
            SJ
          </div>
          <div>
            <div className="font-bold">Sarah Jenkins</div>
            <div className="text-xs text-body-color">CTO, TechNova</div>
          </div>
        </div>
      </motion.section>

      {/* --- 8. Footer --- */}
      <footer className="py-12 mt-12 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-8 md:px-8 text-sm">
        <div className="text-left">
          <div className="text-lg font-serif font-bold">WP Enterprise</div>
          <p className="text-xs text-body-color mt-1">
            © 2026 WP Enterprise. All rights reserved.
          </p>
        </div>
        <div className="flex gap-8 text-xs text-body-color">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Documentation
          </a>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;