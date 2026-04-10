const arrowPathStyle: React.CSSProperties = { borderBlockEndColor: '#f0f0fa', borderBlockStartColor: '#f0f0fa', borderBottomColor: '#f0f0fa', borderInlineEndColor: '#f0f0fa', borderInlineStartColor: '#f0f0fa', borderLeftColor: '#f0f0fa', borderRightColor: '#f0f0fa', borderTopColor: '#f0f0fa', caretColor: '#f0f0fa', columnRuleColor: '#f0f0fa', fontSize: '16px', outlineColor: '#f0f0fa', textAlign: 'left', textDecorationColor: '#f0f0fa', textEmphasisColor: '#f0f0fa', transformOrigin: '0px 0px', WebkitTextFillColor: '#f0f0fa', WebkitTextStrokeColor: '#f0f0fa' };

interface HeroSlideProps {
  title: string;
  description: string;
  ctaLabel: string;
  align: 'left' | 'right';
  backgroundImage?: string;
  gradientStyle?: string;
  centered?: boolean;
}

export default function HeroSlide({ title, description, ctaLabel, align, backgroundImage, gradientStyle, centered }: HeroSlideProps) {
  const contentClass = align === 'left'
    ? `left-25 max-w-162.5 absolute ${centered ? 'top-[50%]' : 'top-[round(13%,1px)]'} w-[round(50%,1px)]`
    : 'max-w-162.5 absolute right-25 top-[round(13%,1px)] w-[round(50%,1px)]';

  return (
    <div className="">
      <div className="relative size-full">
        {backgroundImage ? (
          <div className="items-center [background-position-x:50%] [background-position-y:50%] flex justify-center absolute overflow-clip bg-black size-full">
            <div className="overflow-clip bg-cover bg-center size-full" style={{ backgroundImage: `url(${backgroundImage})` }} />
          </div>
        ) : (
          <div className="left-0 absolute inset-y-0 size-full">
            <div className="left-0 object-cover absolute top-0 overflow-clip size-full" />
          </div>
        )}
        {gradientStyle && (
          <div className="items-center flex justify-center absolute overflow-clip size-full" style={{ backgroundImage: gradientStyle }} />
        )}
        <div className="h-235.25 max-w-425 relative w-full mx-auto">
          <div className={contentClass} style={centered ? { translate: '0px -50%' } : undefined}>
            {align === 'left' ? (
              <div className="tracking-[0.96px] max-w-[90%] uppercase text-[#F0F0FA] font-sans text-5xl/12">{title}</div>
            ) : (
              <div className="tracking-[0.96px] relative uppercase text-[#F0F0FA] font-sans text-5xl/15 m-auto">{title}</div>
            )}
            <div className="mt-3.75 text-[#F0F0FA] font-sans text-base/6">{description}</div>
            <div className="">
              <div className="items-center [border-block-end-style:solid] [border-block-start-style:solid] [border-inline-end-style:solid] [border-inline-start-style:solid] inline-flex h-12 mt-7.5 rounded-sm px-5 bg-[#00000080] [border-width:0.555556px] border-solid border-[#F0F0FA59]">
                <div className="relative text-center uppercase w-full text-[#F0F0FA] font-sans text-xs/3 m-auto">{ctaLabel}</div>
                <div className="items-center flex h-4 ml-2.5 relative">
                  <div className="shrink-0 size-4">
                    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" color="#F0F0FA" preserveAspectRatio="none" style={{ height: '16px', width: '16px', overflow: 'clip' }}>
                      <path d="M11.989 5.584L12.247 5.899L11.989 6.216L8.101 10.978L7.325 10.345L10.548 6.399L1.399 6.399L1.399 5.399L10.548 5.399L7.325 1.454L8.101 0.821L11.989 5.584Z" fill="#F0F0FACC" color="#F0F0FA" style={arrowPathStyle} />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
