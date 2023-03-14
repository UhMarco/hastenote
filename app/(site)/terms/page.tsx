import Link from "next/link";

export default function Terms() {
  const headingStyling = "text-text-light text-lg mt-4 mb-2";

  return (
    <div className="flex flex-col items-center w-full h-auto py-16 px-5 sm:px-[20%] text-sm">
      <h1 className="text-2xl text-text-light font-bold mb-5">Terms and Conditions</h1>

      <div className="flex space-x-2 text-text-dark">
        <h1 className="font-semibold">Useful Links: </h1>
        <Link className="underline" href="/">Home</Link>
        <Link className="underline" href="/signin">Sign in</Link>
        <Link className="underline" href="/register">Register</Link>
        <a className="underline" href="https://github.com/UhMarco/hastenote">GitHub</a>
      </div>

      <div className="text-text-dark">
        <h2 className="text-text-light text-lg mb-2">
          Introduction
        </h2>

        <p>These terms and conditions govern your use of Hastenote.</p>

        <h2 className={headingStyling}>
          Acceptance of Terms
        </h2>

        <p>
          By using the Service, you agree to be bound by these terms and conditions. If you do not agree to these terms and conditions, you should not use the Service.
        </p>

        <h2 className={headingStyling}>
          Use of the Service
        </h2>

        <p>
          The Service is for your personal, non-commercial use only. You may not use the Service for any illegal or unauthorized purpose, or in a way that infringes on the rights of others. You agree to comply with all applicable laws and regulations in your use of the Service.
        </p>

        <h2 className={headingStyling}>
          Intellectual Property
        </h2>

        <p>
          All content included in the Service, including text, graphics, logos, images, and software, is the property of the Company or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, modify, distribute, or otherwise use any of the content without the prior written consent of the Company.
        </p>

        <h2 className={headingStyling}>
          Disclaimer of Warranties
        </h2>

        <p>
          The Service is provided on an {"\""}as is{"\""} and {"\""}as available{"\""} basis. The Company makes no representations or warranties of any kind, express or implied, as to the operation of the Service or the information, content, materials, or products included in the Service. You expressly agree that your use of the Service is at your sole risk.
        </p>

        <h2 className={headingStyling}>
          Limitation of Liability
        </h2>

        <p>
          The Company shall not be liable for any damages, including but not limited to direct, indirect, incidental, punitive, or consequential damages, arising out of or in connection with the use or inability to use the Service, even if the Company has been advised of the possibility of such damages.
        </p>

        <h2 className={headingStyling}>
          Indemnification
        </h2>

        <p>
          You agree to indemnify and hold the Company and its affiliates, officers, agents, and employees harmless from any claim or demand, including reasonable lawyer{"'"} fees, made by any third party due to or arising out of your use of the Service, your violation of these terms and conditions, or your violation of any rights of another.
        </p>

        <h2 className={headingStyling}>
          Changes to Terms and Conditions
        </h2>

        <p>
          The Company reserves the right to modify these terms and conditions at any time, and such modifications shall be effective immediately upon posting on the Service. Your continued use of the Service after the posting of modified terms and conditions shall constitute your acceptance of the modified terms and conditions.
        </p>

        <h2 className={headingStyling}>
          Governing Law and Jurisdiction
        </h2>

        <p>
          These terms and conditions shall be governed by and construed in accordance with the laws of England, without giving effect to any principles of conflicts of law. Any legal action or proceeding arising out of or relating to these terms and conditions shall be brought exclusively in the courts of England.
        </p>

        <h2 className={headingStyling}>
          Entire Agreement
        </h2>

        <p>
          These terms and conditions constitute the entire agreement between you and the Company with respect to the Service and supersede all prior or contemporaneous communications and proposals, whether oral or written, between you and the Company regarding the Service.
        </p>
      </div>
    </div>
  );
}
