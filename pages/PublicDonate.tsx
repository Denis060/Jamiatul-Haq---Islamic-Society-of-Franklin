
import React, { useState, useEffect } from 'react';
import { Heart, CreditCard, Landmark, Globe, Copy, Check, DollarSign, ArrowRight, Utensils, Users } from 'lucide-react';
import { supabase } from '../services/supabase';
import SEO from '../components/SEO';

const PublicDonate = () => {
    const [copied, setCopied] = useState(false);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        supabase.from('masjid_profile').select('*').single().then(({ data }) => {
            if (data) setProfile(data);
        });
    }, []);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const donationOptions = [
        {
            id: 'zakat',
            title: 'Zakat al-Maal',
            description: 'Obligatory charity (2.5% of unused wealth) distributed to the eight categories of people designated by the Quran.',
            icon: <DollarSign size={32} />,
            color: 'bg-emerald-600',
            textColor: 'text-emerald-900',
            buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
            link: profile?.paypal_link || '#'
        },
        {
            id: 'sadaqah',
            title: 'Sadaqah',
            description: 'Voluntary charity that extinguishes sins as water extinguishes fire. Support our community programs and outreach.',
            icon: <Heart size={32} />,
            color: 'bg-amber-500',
            textColor: 'text-amber-900',
            buttonColor: 'bg-amber-500 hover:bg-amber-600',
            link: profile?.launchgood_link || profile?.paypal_link || '#'
        },
        {
            id: 'masjid',
            title: 'Masjid Operations',
            description: 'Support the house of Allah. Funds go towards utilities, maintenance, and daily operations of Jamiatul Haq.',
            icon: <Landmark size={32} />,
            color: 'bg-[#d4af37]',
            textColor: 'text-[#042f24]',
            buttonColor: 'bg-[#d4af37] text-[#042f24] hover:bg-white',
            link: profile?.paypal_link || '#'
        },
        {
            id: 'fitra',
            title: 'Zakat al-Fitr',
            description: 'Obligatory for every Muslim before Eid ($12-$15/person) to ensure the needy can celebrate.',
            icon: <Users size={32} />,
            color: 'bg-purple-600',
            textColor: 'text-purple-900',
            buttonColor: 'bg-purple-600 hover:bg-purple-700',
            link: profile?.paypal_link || '#'
        },
        {
            id: 'iftar',
            title: 'Sponsor Iftar',
            description: 'Feed the community this Ramadan. Reserve your sponsorship date on our Ramadan Hub.',
            icon: <Utensils size={32} />,
            color: 'bg-orange-500',
            textColor: 'text-orange-900',
            buttonColor: 'bg-orange-500 hover:bg-orange-600',
            link: '/ramadan'
        }
    ];

    return (
        <div className="bg-[#fdfbf7] min-h-screen pb-32">
            <SEO
                title="Donate"
                description="Support Jamiatul Haq through your generous donations. Pay Zakat, Sadaqah, or contribute to Masjid operations online."
            />

            {/* Hero Section */}
            <div className="bg-[#042f24] pt-32 pb-48 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-islamic-pattern"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 mihrab-shape -rotate-45 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-sm">
                        Invest in your Akhirah
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-white italic mb-8 tracking-tighter">Support Your Masjid</h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-xl font-medium tracking-wide leading-relaxed">
                        "The likeness of those who spend their wealth in the Way of Allah is as the likeness of a grain (of corn); it grows seven ears, and each ear has a hundred grains."
                        <span className="block mt-4 text-[#d4af37] font-bold">— Surah Al-Baqarah 2:261</span>
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-20">

                {/* Donation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {donationOptions.map((option) => (
                        <div key={option.id} className="bg-white rounded-[2.5rem] p-10 border-4 border-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center text-center group">
                            <div className={`w-20 h-20 rounded-full ${option.color} text-white flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                                {option.icon}
                            </div>
                            <h2 className={`text-2xl font-black italic mb-4 ${option.textColor}`}>{option.title}</h2>
                            <p className="text-slate-500 mb-10 leading-relaxed text-sm flex-grow">
                                {option.description}
                            </p>
                            {option.link !== '#' ? (
                                <a
                                    href={option.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors shadow-md text-white ${option.buttonColor}`}
                                >
                                    Donate Now <ArrowRight size={16} />
                                </a>
                            ) : (
                                <button
                                    disabled
                                    className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 bg-slate-100 text-slate-400 cursor-not-allowed"
                                >
                                    Link Coming Soon
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Alternative Methods */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Bank Transfer */}
                    <div className="bg-white rounded-[3rem] p-12 border-2 border-[#f0e6d2] shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#042f24]/5 rounded-bl-[3rem]"></div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-[#fdfbf7] rounded-2xl text-[#042f24]">
                                <Landmark size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-[#042f24] italic">Bank Transfer</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">For Direct Deposits</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-[#fdfbf7] p-6 rounded-2xl border border-[#f0e6d2] group cursor-pointer hover:border-[#d4af37] transition-colors" onClick={() => handleCopy(profile?.bank_name || "Jamiatul Haq")}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Name / Bank</span>
                                    <Copy size={14} className="text-slate-300 group-hover:text-[#d4af37]" />
                                </div>
                                <div className="font-bold text-[#042f24] text-lg">{profile?.bank_name || "Bank Name"}</div>
                            </div>

                            <div className="bg-[#fdfbf7] p-6 rounded-2xl border border-[#f0e6d2] group cursor-pointer hover:border-[#d4af37] transition-colors" onClick={() => handleCopy(profile?.account_number || "000000000")}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Number</span>
                                    <Copy size={14} className="text-slate-300 group-hover:text-[#d4af37]" />
                                </div>
                                <div className="font-bold text-[#042f24] text-lg">{profile?.account_number || "Not Set"}</div>
                            </div>

                            <div className="bg-[#fdfbf7] p-6 rounded-2xl border border-[#f0e6d2] group cursor-pointer hover:border-[#d4af37] transition-colors" onClick={() => handleCopy(profile?.routing_number || "000000000")}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Routing Number</span>
                                    <div className="flex items-center gap-2">
                                        {copied && <span className="text-[10px] text-green-600 font-bold">Copied!</span>}
                                        {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-slate-300 group-hover:text-[#d4af37]" />}
                                    </div>
                                </div>
                                <div className="font-bold text-[#042f24] text-lg">{profile?.routing_number || "Not Set"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Other Ways */}
                    <div className="bg-[#042f24] rounded-[3rem] p-12 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute inset-0 opacity-10 bg-islamic-pattern"></div>

                        <div>
                            <div className="flex items-center gap-4 mb-8 relative z-10">
                                <div className="p-4 bg-white/10 rounded-2xl text-[#d4af37]">
                                    <Globe size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white italic">Ways to Give</h3>
                                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">More Options</p>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 rounded-full bg-[#d4af37] mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Check / Money Order</h4>
                                        <p className="text-[#aebbb5] text-sm">
                                            Make payable to "Islamic Society of Franklin Township" and mail to:<br />
                                            <span className="text-white font-bold">{profile?.address || "385 Lewis Street, Somerset, NJ 08873"}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 rounded-full bg-[#d4af37] mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Zelle</h4>
                                        <p className="text-white/60 text-sm leading-relaxed">
                                            Send directly using our email:<br />
                                            <span className="text-[#d4af37] font-medium selection:bg-white/20">{profile?.zelle_contact || "admin@jamiatul-haq.org"}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 pt-8 border-t border-white/10 relative z-10">
                            <p className="text-[10px] uppercase tracking-widest text-white/40 text-center">
                                Jamiatul Haq is a 501(c)(3) Non-Profit Organization.<br />
                                All donations are tax-deductible.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PublicDonate;
