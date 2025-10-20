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
    <div className="flex flex-col items-start self-stretch w-full gap-4 sm:gap-6 md:gap-8 lg:gap-8">
      <div className="flex flex-col items-center w-full gap-3 sm:flex-row sm:gap-4 md:gap-6 lg:gap-6">
        {formFields.map((field) => (
          <div
            key={field.id}
            className="flex flex-col items-start w-full gap-2 sm:gap-3 md:gap-3"
          >
            <Label
              htmlFor={field.id}
              className="[font-family:'Barlow',Helvetica] font-semibold text-black text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed lg:text-[20px]"
            >
              {field.label}
            </Label>
            <Input
              id={field.id}
              className="h-[40px] sm:h-[44px] md:h-[48px] border-[#000000b2] rounded-none"
            />
          </div>
        ))}
      </div>

      {fullWidthFields.map((field) => (
        <div key={field.id} className="flex items-center w-full gap-3 sm:gap-4 md:gap-6 lg:gap-6">
          <div className="flex flex-col items-start w-full gap-2 sm:gap-3 md:gap-3">
            <Label
              htmlFor={field.id}
              className="[font-family:'Barlow',Helvetica] font-semibold text-black text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed lg:text-[20px]"
            >
              {field.label}
            </Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.id}
                className="h-[120px] sm:h-[140px] md:h-[160px] border-[#000000b2] rounded-none resize-none"
              />
            ) : (
              <Input
                id={field.id}
                className="h-[40px] sm:h-[44px] md:h-[48px] border-[#000000b2] rounded-none"
              />
            )}
          </div>
        </div>
      ))}

      <Button className="w-[120px] sm:w-[126px] md:w-[132px] lg:w-[140px] h-[40px] sm:h-[44px] md:h-[48px] bg-[#fcc809] hover:bg-[#fcc809]/90 rounded-none p-2">
        <span className="[font-family:'Barlow',Helvetica] font-semibold text-black text-sm sm:text-base md:text-base lg:text-lg tracking-[0] leading-relaxed whitespace-nowrap lg:text-[18px]">
          SUBMIT
        </span>
      </Button>
    </div>
  );
};
