import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";

const formFields = [
  {
    id: "firstName",
    label: "FIRST NAME *",
    type: "input",
    width: "w-full",
  },
  {
    id: "lastName",
    label: "LAST NAME *",
    type: "input",
    width: "w-full",
  },
];

const fullWidthFields = [
  {
    id: "phone",
    label: "PHONE *",
    type: "input",
  },
  {
    id: "email",
    label: "EMAIL *",
    type: "input",
  },
  {
    id: "comments",
    label: "COMMENTS *",
    type: "textarea",
  },
];

export const ContactFormSection = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full max-w-[1050px] items-start gap-6 sm:gap-8 md:gap-10 lg:gap-[34px]">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[50px] w-full">
        {formFields.map((field) => (
          <div
            key={field.id}
            className="flex flex-col w-full items-start gap-3 sm:gap-4 md:gap-[13px]"
          >
            <Label
              htmlFor={field.id}
              className="[font-family:'Barlow',Helvetica] font-semibold text-black text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed lg:text-[20px]"
            >
              {field.label}
            </Label>
            <Input
              id={field.id}
              className="h-[45px] sm:h-[50px] md:h-[55px] border-[#000000b2] rounded-none"
            />
          </div>
        ))}
      </div>

      {fullWidthFields.map((field) => (
        <div key={field.id} className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[50px] w-full">
          <div className="flex flex-col w-full items-start gap-3 sm:gap-4 md:gap-[13px]">
            <Label
              htmlFor={field.id}
              className="[font-family:'Barlow',Helvetica] font-semibold text-black text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed lg:text-[20px]"
            >
              {field.label}
            </Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.id}
                className="h-[150px] sm:h-[170px] md:h-[190px] border-[#000000b2] rounded-none resize-none"
              />
            ) : (
              <Input
                id={field.id}
                className="h-[45px] sm:h-[50px] md:h-[55px] border-[#000000b2] rounded-none"
              />
            )}
          </div>
        </div>
      ))}

      <Button className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[150px] h-[45px] sm:h-[50px] md:h-[55px] bg-[#fcc809] hover:bg-[#fcc809]/90 rounded-none p-2.5">
        <span className="[font-family:'Barlow',Helvetica] font-semibold text-black text-sm sm:text-base md:text-lg lg:text-xl tracking-[0] leading-relaxed whitespace-nowrap lg:text-[20px]">
          SUBMIT
        </span>
      </Button>
    </div>
  );
};
