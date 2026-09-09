"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppData } from "@/lib/store";
import { formatSAPhoneInput } from "@/lib/utils";
import type { Referrer } from "@/lib/types";
import { ShareWhatsAppActions } from "./share-whatsapp-actions";

interface AddReferrerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddReferrerSheet({ open, onOpenChange }: AddReferrerSheetProps) {
  const { addReferrer } = useAppData();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<Referrer | null>(null);

  useEffect(() => {
    if (!open) {
      // Reset a beat after the close animation finishes.
      const t = setTimeout(() => {
        setName("");
        setPhone("");
        setCreated(null);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  async function handleCreate() {
    setSubmitting(true);
    const referrer = await addReferrer({ name, phone });
    setSubmitting(false);
    setCreated(referrer);
  }

  const canCreate = name.trim().length > 1 && phone.replace(/\D/g, "").length === 10;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {!created ? (
          <>
            <SheetHeader>
              <SheetTitle>Add a referrer</SheetTitle>
              <SheetDescription>
                Anyone can be a referrer - a happy customer, a friend, a follower.
              </SheetDescription>
            </SheetHeader>
            <SheetBody className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="referrer-name">Name</Label>
                <Input
                  id="referrer-name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Thando M."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="referrer-phone">Phone number</Label>
                <Input
                  id="referrer-phone"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(formatSAPhoneInput(e.target.value))}
                  placeholder="071 234 5678"
                />
              </div>
            </SheetBody>
            <SheetFooter>
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={!canCreate || submitting}
                onClick={handleCreate}
              >
                {submitting ? "Creating link..." : "Create referral link"}
              </Button>
            </SheetFooter>
          </>
        ) : (
          <>
            <SheetHeader>
              <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-money-tint">
                <Sparkles className="h-5 w-5 text-money" />
              </div>
              <SheetTitle>{created.name.split(" ")[0]}&apos;s referral link is ready</SheetTitle>
              <SheetDescription>
                Share it with them so they can start referring customers.
              </SheetDescription>
            </SheetHeader>
            <SheetBody>
              <ShareWhatsAppActions referrer={created} />
            </SheetBody>
            <SheetFooter>
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                Done
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
