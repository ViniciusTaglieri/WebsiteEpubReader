import * as Select from "@radix-ui/react-select";
import * as Slider from "@radix-ui/react-slider";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { motion } from "framer-motion";
import { ChevronDown, Type } from "lucide-react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import {
  defaultReaderSettings,
  getReaderPreviewState,
  type ReaderAlign,
  type ReaderFlow,
  type ReaderSettings,
  type ReaderSpread,
  type ReaderTheme,
} from "../lib/readerPreview";

const fonts = ["Georgia", "Charter", "Inter", "Atkinson Hyperlegible"];

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface/90 rounded-[10px] border border-line p-4 shadow-[0_16px_38px_rgb(60_38_9_/_8%)]">
      <h3 className="mb-5 flex items-center gap-2 text-xs font-extrabold">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-gold-soft text-gold-strong">
          {icon}
        </span>
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex justify-between gap-3 text-xs font-bold">
        {label}
        <output className="font-medium text-muted">
          {step < 1 ? value.toFixed(2) : value}
          {suffix}
        </output>
      </span>
      <Slider.Root
        className="relative flex h-5 touch-none select-none items-center"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(next ?? value)}
      >
        <Slider.Track className="bg-ink/75 relative h-[5px] grow rounded-full">
          <Slider.Range className="absolute h-full rounded-full bg-gold" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-4 w-4 rounded-full bg-gold shadow-[0_1px_6px_rgb(0_0_0_/_18%)] outline-none ring-surface transition focus:ring-4"
          aria-label={label}
        />
      </Slider.Root>
    </label>
  );
}

function ToggleField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string; disabled?: boolean }>;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold">{label}</div>
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(next) => next && onChange(next as T)}
        className="grid overflow-hidden rounded-md border border-line bg-surface"
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((option) => (
          <ToggleGroup.Item
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="min-h-9 border-r border-line px-2 text-[11px] font-semibold text-ink transition last:border-r-0 hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-40 data-[state=on]:bg-gold-soft data-[state=on]:font-extrabold data-[state=on]:text-gold-strong"
          >
            {option.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}

export function ReaderDemo() {
  const [settings, setSettings] = useState<ReaderSettings>(defaultReaderSettings);
  const preview = useMemo(() => getReaderPreviewState(settings), [settings]);
  const normalized = preview.normalizedSettings;

  function patch(next: Partial<ReaderSettings>) {
    setSettings((current) => ({
      ...current,
      ...next,
      spread: next.flow === "continuous" ? "single" : (next.spread ?? current.spread),
    }));
  }

  return (
    <section id="demo" className="border-y border-line py-16">
      <div className="mx-auto mb-10 max-w-[720px] px-5 text-center">
        <h2 className="font-display text-[clamp(2.15rem,4vw,3rem)] font-black tracking-[-0.03em]">
          Leitura personalizada
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-[17px] leading-7 text-muted">
          Ajuste a previa como no app: fonte, tamanho, margem, temas, alinhamento e modo de leitura
          respondem na hora.
        </p>
      </div>
      <div className="mx-auto grid w-[min(100%-32px,1240px)] grid-cols-1 items-start gap-7 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[450px_minmax(0,1fr)]">
        <Panel title="Aparencia, layout e navegacao" icon={<Type size={17} />}>
          <div>
            <div className="mb-2 text-xs font-bold">Fonte</div>
            <Select.Root
              value={settings.fontFamily}
              onValueChange={(fontFamily) => patch({ fontFamily })}
            >
              <Select.Trigger className="flex h-9 w-full items-center justify-between rounded-md border border-line bg-surface px-3 text-xs font-semibold">
                <Select.Value />
                <Select.Icon>
                  <ChevronDown size={14} />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="z-50 overflow-hidden rounded-md border border-line bg-surface shadow-product">
                  <Select.Viewport>
                    {fonts.map((font) => (
                      <Select.Item
                        key={font}
                        value={font}
                        className="cursor-pointer px-3 py-2 text-sm outline-none hover:bg-gold-soft data-[highlighted]:bg-gold-soft"
                      >
                        <Select.ItemText>{font}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <ToggleField<ReaderTheme>
            label="Tema de leitura"
            value={settings.theme}
            onChange={(theme) => patch({ theme })}
            options={[
              { value: "sepia", label: "Sepia" },
              { value: "light", label: "Claro" },
              { value: "dark", label: "Escuro" },
              { value: "oled", label: "OLED" },
            ]}
          />
          <RangeField
            label="Tamanho da fonte"
            value={settings.fontSize}
            min={15}
            max={26}
            suffix="px"
            onChange={(fontSize) => patch({ fontSize })}
          />
          <RangeField
            label="Margem"
            value={settings.margin}
            min={0}
            max={64}
            suffix="px"
            onChange={(margin) => patch({ margin })}
          />
          <RangeField
            label="Espacamento de linha"
            value={settings.lineHeight}
            min={1.25}
            max={1.95}
            step={0.05}
            suffix=""
            onChange={(lineHeight) => patch({ lineHeight })}
          />
          <RangeField
            label="Espacamento de paragrafo"
            value={settings.paragraphSpacing}
            min={0.2}
            max={1.4}
            step={0.1}
            suffix="em"
            onChange={(paragraphSpacing) => patch({ paragraphSpacing })}
          />
          <div className="border-t border-line pt-4">
            <ToggleField<ReaderAlign>
              label="Alinhamento"
              value={settings.textAlign}
              onChange={(textAlign) => patch({ textAlign })}
              options={[
                { value: "left", label: "Esquerda" },
                { value: "justify", label: "Justificado" },
              ]}
            />
          </div>
          <ToggleField<ReaderFlow>
            label="Modo de leitura"
            value={settings.flow}
            onChange={(flow) => patch({ flow })}
            options={[
              { value: "paginated", label: "Paginado" },
              { value: "continuous", label: "Continuo" },
            ]}
          />
          <ToggleField<ReaderSpread>
            label="Modo"
            value={normalized.spread}
            onChange={(spread) => patch({ spread })}
            options={[
              { value: "single", label: "Uma" },
              {
                value: "double",
                label: "Duas",
                disabled: normalized.flow === "continuous",
              },
            ]}
          />
        </Panel>

        <motion.article
          className="border-gold/35 flex min-h-[680px] flex-col overflow-hidden rounded-xl border shadow-[0_34px_90px_color-mix(in_oklch,var(--accent)_18%,transparent),0_26px_70px_rgb(55_38_18_/_14%)] ring-1 ring-white/80"
          animate={{
            backgroundColor: String(preview.readerStyle.backgroundColor),
          }}
          transition={{ duration: 0.22 }}
        >
          <div
            className="reader-preview flex-1"
            style={
              {
                ...preview.readerStyle,
                "--reader-family": preview.readerStyle.fontFamily,
              } as CSSProperties
            }
          >
            <div
              className="reader-pages"
              data-flow={normalized.flow}
              data-spread={normalized.spread}
              style={{ paddingInline: "var(--reader-margin)" }}
            >
              <div>
                <p>
                  <strong>79 A PRADARIA.</strong> Examinar com atencao as linhas do rosto, ou mexer
                  nas protuberancias da cabeca desse Leviata; essas sao ocupacoes que nenhum
                  Fisionomista ou Frenologista tomou para si ate agora.
                </p>
                <p>
                  Tal iniciativa pareceria tao propicia quanto para Lavater a de analisar as
                  dobraduras do Rochedo de Gibraltar, ou para Gall a de subir numa escada e tocar a
                  Cupula do Panteao.
                </p>
                <p>
                  No entanto, em sua obra famosa, Lavater nao apenas discorre sobre os varios rostos
                  dos homens, como tambem estuda com cuidado os rostos dos cavalos, passaros,
                  serpentes e peixes.
                </p>
              </div>
              <div className={normalized.spread === "double" ? "block" : "hidden"}>
                <p>
                  Por isso, apesar de ser pouco qualificado para um pioneiro, na aplicacao dessas
                  duas semiciencias a baleia farei minha tentativa. Experimento de tudo; e termino o
                  que posso.
                </p>
                <p>
                  Do ponto de vista fisiognomonico, o Cachalote e uma criatura anomala. Ele nao
                  possui um nariz de verdade. E uma vez que o nariz e o mais importante e conspicuo
                  dos predicados.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-surface/90 border-t border-line px-6 py-4 text-xs text-ink">
            <div className="mb-2 grid grid-cols-3 gap-3">
              <span>Capitulo: 83 / 150</span>
              <span className="text-center">Pagina 514 / 925</span>
              <span className="text-right">56% do livro</span>
            </div>
            <div className="bg-ink/80 relative h-[6px] rounded-full">
              <div className="h-full w-[56%] rounded-full bg-gold" />
              <div className="absolute left-[56%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-gold shadow" />
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
