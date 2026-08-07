// js/resume.js

function downloadResume() {
    const btn = document.querySelector('a[onclick*="downloadResume"]');
    const originalText = btn.innerHTML;
    
    // UI Update to show loading
    btn.innerHTML = 'Generating ATS PDF... <i class="fas fa-spinner fa-spin"></i>';
    btn.style.pointerEvents = 'none';

    // Load pdfmake dynamically if not present
    if (typeof pdfMake === 'undefined') {
        const scriptPdf = document.createElement('script');
        scriptPdf.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js';
        
        const scriptVfs = document.createElement('script');
        scriptVfs.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js';
        
        scriptPdf.onload = () => {
            document.head.appendChild(scriptVfs);
        };
        scriptVfs.onload = () => {
            generatePDF(btn, originalText);
        };
        
        document.head.appendChild(scriptPdf);
    } else {
        generatePDF(btn, originalText);
    }
}

function generatePDF(btn, originalText) {
    try {
        const accentColor = '#0056b3';
        const darkColor = '#222222';
        
        // Ensure resumeData exists
        if (typeof resumeData === 'undefined') {
            throw new Error("Resume data not found.");
        }
        
        const d = resumeData;

        // Build the projects list
        const projectsList = [];
        d.projects.forEach(proj => {
            projectsList.push({ text: proj.title, style: 'subheading', margin: [0, 5, 0, 2] });
            projectsList.push({ text: 'Tech Stack: ' + proj.techStack, style: 'techStack', margin: [0, 0, 0, 3] });
            projectsList.push({
                ul: proj.features,
                margin: [10, 0, 0, 8],
                style: 'listText'
            });
        });

        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 40, 40, 40],
            info: {
                title: d.personal.name + ' Resume',
                author: d.personal.name,
                subject: 'Resume',
                keywords: 'Resume, ATS, ' + d.personal.name
            },
            content: [
                // Header
                { text: d.personal.name.toUpperCase(), style: 'header', alignment: 'center' },
                { 
                    text: [
                        { text: d.personal.email, link: 'mailto:' + d.personal.email }, '  |  ',
                        { text: 'Portfolio', link: d.personal.portfolio }, '  |  ',
                        { text: 'LinkedIn', link: d.personal.linkedin }, '  |  ',
                        { text: 'GitHub', link: d.personal.github }
                    ],
                    style: 'contact',
                    alignment: 'center',
                    margin: [0, 5, 0, 15]
                },
                
                // Summary
                { text: 'SUMMARY', style: 'sectionTitle' },
                { text: d.summary, style: 'normalText', margin: [0, 0, 0, 15] },
                
                // Education
                { text: 'EDUCATION', style: 'sectionTitle' },
                {
                    columns: [
                        { text: d.education[0].degree + ' in ' + d.education[0].branch, style: 'boldText' },
                    ]
                },
                { text: d.education[0].college, style: 'italicText', margin: [0, 2, 0, 2] },
                { text: d.education[0].note, style: 'smallNote', margin: [0, 0, 0, 15] },

                // Technical Skills
                { text: 'TECHNICAL SKILLS', style: 'sectionTitle' },
                {
                    table: {
                        widths: [80, '*'],
                        body: [
                            [
                                { text: 'Languages', style: 'skillCategory' },
                                { text: d.skills.languages.join(', '), style: 'skillList' }
                            ],
                            [
                                { text: 'Database', style: 'skillCategory' },
                                { text: d.skills.database.join(', '), style: 'skillList' }
                            ],
                            [
                                { text: 'Tools', style: 'skillCategory' },
                                { text: d.skills.tools.join(', '), style: 'skillList' }
                            ]
                        ]
                    },
                    layout: 'noBorders',
                    margin: [0, 0, 0, 15]
                },

                // Projects
                { text: 'PROJECTS', style: 'sectionTitle' },
                ...projectsList,

                // Leadership
                { text: 'LEADERSHIP', style: 'sectionTitle' },
                { text: d.leadership[0].role, style: 'boldText', margin: [0, 0, 0, 2] },
                { text: d.leadership[0].description, style: 'normalText', margin: [0, 0, 0, 15] },

                // Languages
                { text: 'LANGUAGES', style: 'sectionTitle' },
                { text: d.languages.join('  •  '), style: 'normalText' }
            ],
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    color: accentColor,
                    characterSpacing: 1
                },
                contact: {
                    fontSize: 10,
                    color: accentColor
                },
                sectionTitle: {
                    fontSize: 12,
                    bold: true,
                    color: accentColor,
                    margin: [0, 10, 0, 5],
                    // A subtle bottom border using a canvas line is not ideal for ATS if it breaks text,
                    // but it's okay for design. We will just use background or nothing for 100% ATS safety.
                },
                normalText: {
                    fontSize: 10,
                    color: darkColor,
                    lineHeight: 1.3
                },
                boldText: {
                    fontSize: 11,
                    bold: true,
                    color: darkColor
                },
                italicText: {
                    fontSize: 10,
                    italics: true,
                    color: darkColor
                },
                smallNote: {
                    fontSize: 9,
                    color: '#666666',
                    italics: true
                },
                skillCategory: {
                    fontSize: 10,
                    bold: true,
                    color: darkColor,
                    margin: [0, 2, 0, 2]
                },
                skillList: {
                    fontSize: 10,
                    color: darkColor,
                    margin: [0, 2, 0, 2]
                },
                subheading: {
                    fontSize: 11,
                    bold: true,
                    color: darkColor
                },
                techStack: {
                    fontSize: 9,
                    italics: true,
                    color: accentColor
                },
                listText: {
                    fontSize: 10,
                    color: darkColor,
                    lineHeight: 1.2
                }
            },
            defaultStyle: {
                font: 'Roboto', // vfs_fonts provides Roboto out of the box
                color: '#333333'
            }
        };

        // Create PDF and download
        pdfMake.createPdf(docDefinition).download('Dhananjay_Palekar_Resume.pdf');
        
        // Reset Button
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.pointerEvents = 'auto';
        }, 1000);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Could not generate PDF. Please try again later.');
        btn.innerHTML = originalText;
        btn.style.pointerEvents = 'auto';
    }
}
