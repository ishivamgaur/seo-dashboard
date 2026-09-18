import React from 'react';

const ContactSection = ({ data }) => {
  if (!data) return null;

  const { phone, email, address, mapEmbed } = data;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black border-b-4 border-[#FFAD00] inline-block pb-2">
            Contact Us
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-3xl shadow-xl overflow-hidden">
          
          <div className="w-full lg:w-1/3 p-10 bg-black text-white flex flex-col justify-center">
            <h3 className="text-2xl font-semibold mb-8 text-[#FFAD00]">Get In Touch</h3>
            
            <div className="space-y-8">
              {phone && (
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Phone</h4>
                  <p className="text-lg">{phone}</p>
                </div>
              )}
              
              {email && (
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Email</h4>
                  <p className="text-lg">{email}</p>
                </div>
              )}
              
              {address && (
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Address</h4>
                  <p className="text-lg whitespace-pre-line">{address}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full lg:w-2/3 min-h-[400px] relative">
            {mapEmbed ? (
              <div 
                className="w-full h-full absolute inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                dangerouslySetInnerHTML={{ __html: mapEmbed }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                Map not available
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
