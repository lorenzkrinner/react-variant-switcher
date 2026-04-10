function DigitRoller({ count, topClass }: { count: number; topClass: string }) {
  return (
    <div className="h-3.25 relative w-2 overflow-clip">
      <div className={`absolute ${topClass} w-full`}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="items-center flex h-3.25 justify-center">
            <div className="flex text-right uppercase w-max text-[#F0F0FAE6] font-sans shrink-0 text-xs/[11.28px]">
              {i}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const digitLabel = "inline-block text-right uppercase w-max text-[#F0F0FAE6] font-sans shrink-0 text-xs/[11.28px]";

export default function LaunchCountdown() {
  return (
    <div className="absolute right-[round(5%,1px)]">
      <div className="items-center [border-block-end-style:solid] [border-block-start-style:solid] [border-inline-end-style:solid] [border-inline-start-style:solid] inline-flex h-7.75 rounded-sm px-2.5 [border-width:0.555556px] border-solid border-[#FFFFFF40]">
        <div className="tracking-[1px] relative uppercase top-px w-max text-[#F0F0FAE6] font-sans shrink-0 text-[10px]/[9.4px]">
          Upcoming Launches
        </div>
        <div className="w-32 shrink-0">
          <div className="">
            <div className="">
              <div className="items-center inline-flex [justify-content:right]">
                <div className={digitLabel}>T-</div>
                <div className=""><DigitRoller count={3} topClass="-top-3.25" /></div>
                <div className=""><DigitRoller count={10} topClass="-top-6.5" /></div>
                <div className={digitLabel}>:</div>
                <div className=""><DigitRoller count={6} topClass="top-0" /></div>
                <div className=""><DigitRoller count={10} topClass="-top-26" /></div>
                <div className={digitLabel}>:</div>
                <div className=""><DigitRoller count={6} topClass="-top-13" /></div>
                <div className=""><DigitRoller count={10} topClass="[top:-14.3971px]" /></div>
              </div>
            </div>
          </div>
        </div>
        <div className="invisible w-0 shrink-0">
          <div className="inline-block h-2.25 w-2.25">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" color="#F0F0FA" preserveAspectRatio="none" style={{ height: '9px', width: '9px', overflow: 'clip' }}>
              <path d="M1 1L5 5L9 1" stroke="" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#F0F0FA" fill="none" style={{ borderBlockEndColor: '#f0f0fa', borderBlockStartColor: '#f0f0fa', borderBottomColor: '#f0f0fa', borderInlineEndColor: '#f0f0fa', borderInlineStartColor: '#f0f0fa', borderLeftColor: '#f0f0fa', borderRightColor: '#f0f0fa', borderTopColor: '#f0f0fa', caretColor: '#f0f0fa', columnRuleColor: '#f0f0fa', fontSize: '16px', outlineColor: '#f0f0fa', textAlign: 'right', textDecorationColor: '#f0f0fa', textEmphasisColor: '#f0f0fa', transformOrigin: '0px 0px', WebkitTextFillColor: '#f0f0fa', WebkitTextStrokeColor: '#f0f0fa' }} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
