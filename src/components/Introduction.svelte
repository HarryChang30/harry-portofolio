<script>
    import { _ } from '../lib/i18n.js';
</script>

<section id="introduction" class="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center py-16 md:py-0">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div class="order-2 md:order-1">
                <div class="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-blue-700 bg-blue-50 rounded-full">
                    Backend Software Engineer
                </div>
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                    Hi, I'm <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Harry</span>
                </h1>
                <p class="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
                    {$_('bio.paragraph1')}
                </p>
                <p class="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
                    {$_('bio.paragraph2')}
                </p>
                <p class="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
                    {$_('bio.paragraph3')}
                </p>
                <div class="flex flex-wrap gap-4">
                    <a 
                        href="#projects" 
                        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        View My Work
                    </a>
                    <a 
                        href="#experience" 
                        class="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                    >
                        Experience
                    </a>
                </div>
            </div>
            <div class="order-1 md:order-2 flex justify-center">
                <img 
                  src="/logos/go-mascot.jpg" 
                  alt="Harry Chang" 
                  class="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl object-cover shadow-2xl"
                />
            </div>
        </div>
    </div>
</section>
