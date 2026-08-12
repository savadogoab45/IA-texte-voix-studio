"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Check,
  KeyRound,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  User,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [name, setName] = useState("Genie");
  const [email, setEmail] = useState("votre@email.com");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    setSaved(false);

    // La connexion à Prisma / Better Auth
    // pourra être ajoutée ici plus tard.

    await new Promise((resolve) =>
      setTimeout(resolve, 700),
    );

    setIsSaving(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <div
      className="
        relative
        mx-auto
        w-full
        max-w-5xl
        text-slate-900
        dark:text-slate-100
      "
    >
      {/* =========================================
          HEADER
          ========================================= */}
      <div className="mb-8">
        <Button
          asChild
          variant="ghost"
          className="
            -ml-2
            mb-5
            rounded-lg
            text-slate-600
            hover:bg-slate-100
            hover:text-slate-900

            dark:text-slate-400
            dark:hover:bg-[#10213d]
            dark:hover:text-slate-100
          "
        >
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 size-4" />
            Retour au dashboard
          </Link>
        </Button>

        <div className="flex items-center gap-4">
          <div
            className="
              flex
              size-12
              items-center
              justify-center
              rounded-xl
              bg-sky-50

              dark:bg-sky-950/50
              dark:shadow-lg
              dark:shadow-sky-950/20
            "
          >
            <UserRound
              className="
                size-6
                text-sky-600
                dark:text-sky-400
              "
            />
          </div>

          <div>
            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
                dark:text-slate-100
                sm:text-3xl
              "
            >
              Mon profil
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Gérez vos informations personnelles et
              la sécurité de votre compte.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          PROFILE HEADER CARD
          ========================================= */}
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm

          dark:border-[#1e3354]
          dark:bg-[#0b1830]
          dark:shadow-lg
          dark:shadow-blue-950/10
        "
      >
        {/* Blue background */}
        <div
          className="
            relative
            h-28
            overflow-hidden
            bg-sky-50

            dark:bg-[#071a33]
          "
        >
          <div
            className="
              absolute
              -right-10
              -top-20
              size-56
              rounded-full
              bg-sky-400/20
              blur-3xl

              dark:bg-sky-500/10
            "
          />

          <div
            className="
              absolute
              -bottom-20
              left-1/3
              size-48
              rounded-full
              bg-cyan-400/20
              blur-3xl

              dark:bg-cyan-500/10
            "
          />
        </div>

        <div
          className="
            relative
            px-5
            pb-6
            sm:px-7
          "
        >
          {/* Avatar */}
          <Avatar
            className="
              -mt-12
              size-24
              rounded-2xl
              border-4
              border-white
              bg-sky-100
              shadow-md

              dark:border-[#0b1830]
              dark:bg-sky-950
            "
          >
            <AvatarFallback
              className="
                rounded-xl
                bg-sky-100
                text-2xl
                font-bold
                text-sky-700

                dark:bg-sky-950
                dark:text-sky-300
              "
            >
              {name
                .trim()
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="mt-4">
            <h2
              className="
                text-xl
                font-bold
                text-slate-900
                dark:text-slate-100
              "
            >
              {name || "Votre nom"}
            </h2>

            <p
              className="
                mt-1
                flex
                items-center
                gap-1.5
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              <Mail className="size-3.5" />
              {email || "votre@email.com"}
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          PERSONAL INFORMATION
          ========================================= */}
      <div
        className="
          mt-6
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm

          dark:border-[#1e3354]
          dark:bg-[#0b1830]
          dark:shadow-lg
          dark:shadow-blue-950/10

          sm:p-7
        "
      >
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-xl
                bg-sky-50

                dark:bg-sky-950/50
              "
            >
              <User
                className="
                  size-5
                  text-sky-600
                  dark:text-sky-400
                "
              />
            </div>

            <div>
              <h2
                className="
                  font-semibold
                  text-slate-900
                  dark:text-slate-100
                "
              >
                Informations personnelles
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Modifiez les informations de votre profil.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Nom
            </label>

            <Input
              id="name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Votre nom"
              className="
                h-11
                rounded-xl
                border-slate-200
                bg-white
                text-slate-900
                shadow-sm
                placeholder:text-slate-400

                focus-visible:border-sky-500
                focus-visible:ring-sky-500/20

                dark:border-[#1e3354]
                dark:bg-[#071a33]
                dark:text-slate-100
                dark:placeholder:text-slate-500
                dark:focus-visible:border-sky-500
                dark:focus-visible:ring-sky-500/20
              "
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Adresse email
            </label>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="votre@email.com"
              className="
                h-11
                rounded-xl
                border-slate-200
                bg-white
                text-slate-900
                shadow-sm
                placeholder:text-slate-400

                focus-visible:border-sky-500
                focus-visible:ring-sky-500/20

                dark:border-[#1e3354]
                dark:bg-[#071a33]
                dark:text-slate-100
                dark:placeholder:text-slate-500
                dark:focus-visible:border-sky-500
                dark:focus-visible:ring-sky-500/20
              "
            />
          </div>
        </div>

        {/* Save */}
        <div
          className="
            mt-6
            flex
            flex-col-reverse
            gap-3
            border-t
            border-slate-100
            pt-6

            dark:border-[#1e3354]

            sm:flex-row
            sm:justify-end
          "
        >
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="
              rounded-xl
              shadow-sm
              shadow-sky-500/10
            "
          >
            {isSaving ? (
              <>
                <span
                  className="
                    mr-2
                    size-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white/30
                    border-t-white
                  "
                />

                Enregistrement...
              </>
            ) : saved ? (
              <>
                <Check className="mr-2 size-4" />
                Enregistré
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>

      {/* =========================================
          SECURITY
          ========================================= */}
      <div
        className="
          mt-6
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm

          dark:border-[#1e3354]
          dark:bg-[#0b1830]
          dark:shadow-lg
          dark:shadow-blue-950/10
        "
      >
        <div className="p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-xl
                bg-sky-50

                dark:bg-sky-950/50
              "
            >
              <ShieldCheck
                className="
                  size-5
                  text-sky-600
                  dark:text-sky-400
                "
              />
            </div>

            <div>
              <h2
                className="
                  font-semibold
                  text-slate-900
                  dark:text-slate-100
                "
              >
                Sécurité
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Gérez la sécurité de votre compte.
              </p>
            </div>
          </div>

          <div
            className="
              mt-6
              flex
              flex-col
              gap-4
              rounded-xl
              border
              border-slate-100
              bg-slate-50
              p-4

              dark:border-[#1e3354]
              dark:bg-[#071a33]

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  size-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-white

                  dark:bg-[#0b1830]
                "
              >
                <KeyRound
                  className="
                    size-4
                    text-slate-500
                    dark:text-slate-400
                  "
                />
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-900
                    dark:text-slate-100
                  "
                >
                  Mot de passe
                </p>

                <p
                  className="
                    text-xs
                    text-slate-500
                    dark:text-slate-500
                  "
                >
                  Modifiez régulièrement votre mot de passe.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="
                rounded-xl
                border-slate-200
                bg-white
                text-slate-700
                hover:bg-slate-100

                dark:border-[#244166]
                dark:bg-[#0b1830]
                dark:text-slate-300
                dark:hover:bg-[#10213d]
                dark:hover:text-slate-100
              "
            >
              Modifier
            </Button>
          </div>
        </div>
      </div>

      {/* =========================================
          DANGER / LOGOUT
          ========================================= */}
      <div
        className="
          mt-6
          rounded-2xl
          border
          border-red-100
          bg-white
          p-5
          shadow-sm

          dark:border-red-950/50
          dark:bg-[#0b1830]

          sm:p-7
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h2
              className="
                font-semibold
                text-slate-900
                dark:text-slate-100
              "
            >
              Déconnexion
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Déconnectez-vous de votre compte sur cet appareil.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="
              rounded-xl
              border-red-200
              bg-white
              text-red-600
              hover:bg-red-50
              hover:text-red-700

              dark:border-red-900/60
              dark:bg-[#0b1830]
              dark:text-red-400
              dark:hover:bg-red-950/30
              dark:hover:text-red-300
            "
          >
            <Link href="/login">
              <LogOut className="mr-2 size-4" />
              Déconnexion
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}