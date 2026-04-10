function NavItem({ label, hasDropdown = false, uppercase = true }: { label: string; hasDropdown?: boolean; uppercase?: boolean }) {
  const textClass = `tracking-[1.17072px] ${uppercase ? 'uppercase ' : ''}w-max text-[#F0F0FAE6] font-['Arial-BoldMT','Arial',system-ui,sans-serif] font-bold shrink-0 text-[13.008px]/[12.2275px]`;

  if (!hasDropdown) {
    return (
      <div className="items-center flex relative pr-3.25 gap-[0_4px]">
        <div className={textClass}>{label}</div>
      </div>
    );
  }
  return (
    <div className="">
      <div className="">
        <div className="items-center flex relative pr-0.75 gap-[0_4px]">
          <div className={textClass}>{label}</div>
          <div className="min-w-2.5 relative -top-px filter-[brightness(0.8)]" />
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  return (
    <div className="items-center flex py-6 px-15 gap-[0_40px] relative">
      <div className="">
        <div className="relative">
          <div className="[-webkit-text-decorations-in-effect:underline]">
            <div className="">
              <svg xmlns="http://www.w3.org/2000/svg" width="147" height="19" viewBox="0 0 147 19" fill="none" color="#0000EE" style={{ height: '19px', width: '147px', overflow: 'clip' }}>
                <g color="#0000EE" fill="none" style={{ borderBlockEndColor: '#00e', borderBlockStartColor: '#00e', borderBottomColor: '#00e', borderInlineEndColor: '#00e', borderInlineStartColor: '#00e', borderLeftColor: '#00e', borderRightColor: '#00e', borderTopColor: '#00e', caretColor: '#00e', columnRuleColor: '#00e', fontSize: '16px', outlineColor: '#00e', textDecorationColor: '#00e', textEmphasisColor: '#00e', transformOrigin: '0px 0px', WebkitTextFillColor: '#00e', WebkitTextStrokeColor: '#00e' }}>
                  <path d="M33.456 7.101C35.943 7.101 37.502 8.144 37.502 9.997V11.238C37.502 13.208 36.159 14.069 33.67 14.069H24.752V18.406H21.334V7.101H33.456ZM146.805 0.545V0.562C141.398 1.001 120.15 3.63 105.414 18.406H99.946L100.557 17.799C103.641 14.827 117.282 2.231 146.803 0.543L146.805 0.545ZM56.24 18.404H52.166L50.36 15.929H39.817L41.627 14H48.953L45.429 9.173L47.509 6.62L56.24 18.404ZM72.184 7.099C74.009 7.099 75.302 7.729 75.634 9.07H62.808V16.28H75.634C75.269 17.773 74.489 18.404 72.283 18.404H62.579C60.904 18.404 59.327 17.725 59.327 15.921V9.582C59.327 7.778 60.904 7.099 62.579 7.099H72.184ZM90.722 12.834H83.825V16.28H95.649V18.404H80.348V10.898H90.722V12.834ZM120.998 18.404H115.584L110.775 14.908H110.777C111.663 14.217 112.602 13.523 113.51 12.901L120.998 18.404ZM12.935 7.099C14.825 7.099 15.904 8.027 16.236 9.07H3.594V11.505H13.398V11.503C15.372 11.615 16.568 12.46 16.568 14.049V15.854C16.568 17.608 15.524 18.401 13.433 18.401H3.43C1.524 18.401 0.429 17.69 0.113 16.278H13.485V13.693H3.545C1.704 13.704 0.459 12.858 0.459 11.369V9.582C0.459 7.876 1.669 7.099 3.777 7.099H12.935ZM24.752 12H33.044C34.386 12 34.536 11.551 34.536 10.741V10.298C34.536 9.502 34.337 9.072 32.877 9.072H24.773L24.752 12ZM109.604 9.879C108.627 10.455 107.562 11.12 106.646 11.733L100.298 7.099H105.705L109.604 9.879ZM109.607 9.881L109.604 9.879L109.607 9.878V9.881ZM95.811 9.07H80.348V7.099H95.811V9.07Z" fill="#F0F0FA" color="#0000EE" style={{ borderBlockEndColor: '#00e', borderBlockStartColor: '#00e', borderBottomColor: '#00e', borderInlineEndColor: '#00e', borderInlineStartColor: '#00e', borderLeftColor: '#00e', borderRightColor: '#00e', borderTopColor: '#00e', caretColor: '#00e', columnRuleColor: '#00e', fontSize: '16px', outlineColor: '#00e', textDecorationColor: '#00e', textEmphasisColor: '#00e', transformOrigin: '0px 0px', WebkitTextFillColor: '#00e', WebkitTextStrokeColor: '#00e' }} />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-[0_24px]">
        <NavItem label="Vehicles" hasDropdown />
        <NavItem label="Human Spaceflight" hasDropdown />
        <NavItem label="Starlink" />
        <NavItem label="Starshield" />
        <NavItem label="xAI" hasDropdown uppercase={false} />
        <NavItem label="Terafab" />
        <NavItem label="Company" hasDropdown />
        <NavItem label="Shop" hasDropdown />
      </div>
    </div>
  );
}
