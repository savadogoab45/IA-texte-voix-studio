"use client";

import { useState } from "react";
import { toast } from "sonner";

import { api } from "@/trpc/react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea } from "@/components/ui";

export function GeneratorPanel() {
  const utils = api.useUtils();
  const [title, setTitle] = useState("Script audio");
  const [prompt, setPrompt] = useState("");
  const generate = api.generation.create.useMutation({
    onSuccess: async () => {
      toast.success("Generation ajoutee a l'historique");
      setPrompt("");
      await utils.generation.getAllMine.invalidate();
    },
    onError: (error) => toast.error(error.message)
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generation texte</CardTitle>
        <CardDescription>Transformez une idee en brouillon reutilisable.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
              generate.mutate({
                documentId: "",
                title,
                prompt,
                providerVoice: "OPENAI",
                voiceId: "",
              });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Decris le contenu a produire..."
            />
          </div>
          <Button type="submit" disabled={generate.isPending || prompt.length < 10}>
            Generer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
