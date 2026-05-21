import * as Select from '@radix-ui/react-select'
import * as Slider from '@radix-ui/react-slider'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { motion } from 'framer-motion'
import {
  AlignJustify,
  AlignLeft,
  BookOpen,
  ChevronDown,
  Columns2,
  RotateCcw,
  ScrollText,
  Square,
  Type,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import {
  defaultReaderSettings,
  getReaderPreviewState,
  type ReaderAlign,
  type ReaderFlow,
  type ReaderSettings,
  type ReaderSpread,
  type ReaderTheme,
} from '../lib/readerPreview'

const fonts = [
  { label: 'Georgia', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Inter', value: 'Inter, "Segoe UI", Arial, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Mono', value: '"Courier New", Courier, monospace' },
]

const readerText = [
  {
    title: 'Capítulo 1.',
  },
  {
    body: 'Examinar com atenção as linhas de um texto também é uma forma de caminhar. Cada ajuste de fonte, margem e ritmo muda a distância entre o leitor e a página, como se o livro se abrisse de novo em outra luz.',
  },
  {
    body: 'Um bom app de leitura precisa desaparecer no momento certo: guardar a posição, respeitar o tamanho escolhido, reduzir atrito e permitir que a página fique confortável por minutos ou por horas.',
  },
  {
    body: 'Leitores experientes costumam alternar entre margens largas para estudo e margens estreitas para avançar mais rápido. A tipografia faz parte desse pacto silencioso entre concentração, descanso visual e memória.',
  },
  {
    body: 'Uma curiosidade: muitos leitores preferem linhas com algo entre 55 e 75 caracteres porque o olho encontra a próxima linha com menos esforço. Por isso a largura da coluna importa tanto quanto o tamanho da fonte.',
  },
  {
    body: 'Quando o modo de duas páginas está ativo, o conteúdo não deve virar outro trecho. Ele deve continuar sendo o mesmo texto, apenas distribuído em duas colunas, aproximando a experiência de um livro aberto.',
  },
  {
    body: 'A prévia abaixo é curta de propósito, mas precisa se comportar como um leitor real: se o texto ficar grande demais para a página, ele é cortado pela área visível em vez de empurrar a barra inferior para fora.',
  },
]

function Panel({
  title,
  icon,
  onReset,
  children,
}: {
  title: string
  icon: React.ReactNode
  onReset?: () => void
  children: React.ReactNode
}) {
  return (
    <div className="bg-surface/90 rounded-[10px] border border-line p-4 shadow-[0_16px_38px_rgb(60_38_9_/_8%)]">
      <h3 className="mb-5 flex items-center justify-between gap-2 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gold-soft text-gold-strong">
            {icon}
          </span>
          {title}
        </div>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="flex h-9 items-center justify-center gap-2 rounded-md border border-line bg-surface px-3 text-xs font-semibold text-ink transition hover:bg-gold-soft hover:text-gold-strong"
            aria-label="Restaurar configurações padrão"
          >
            <RotateCcw size={14} />
          </button>
        ) : null}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
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
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix: string
  onChange: (value: number) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 flex justify-between gap-3 text-xs font-medium">
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
        <div className="absolute h-[5px] w-full rounded-full bg-zinc-400/25"></div>
        <Slider.Track className="bg-ink/75 relative h-[5px] grow rounded-full">
          <Slider.Range className="absolute h-full rounded-full bg-gold" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-4 w-4 rounded-full bg-gold shadow-[0_1px_6px_rgb(0_0_0_/_18%)] outline-none ring-surface transition focus:ring-4"
          aria-label={label}
        />
      </Slider.Root>
    </label>
  )
}

function ToggleField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: Array<{
    value: T
    label: string
    icon?: React.ReactNode
    disabled?: boolean
  }>
  onChange: (value: T) => void
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium">{label}</div>
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
            className="flex min-h-9 items-center justify-center gap-1.5 border-r border-line px-2 text-[11px] font-medium text-ink transition last:border-r-0 hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-40 data-[state=on]:bg-gold-soft data-[state=on]:font-bold data-[state=on]:text-gold-strong"
          >
            {option.icon}
            {option.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  )
}

function ThemeField({
  value,
  onChange,
}: {
  value: ReaderTheme
  onChange: (value: ReaderTheme) => void
}) {
  const themes: Array<{
    value: ReaderTheme
    label: string
    dotClassName: string
    centerClassName: string
  }> = [
    {
      value: 'light',
      label: 'Claro',
      dotClassName: 'border-slate-400 bg-slate-700',
      centerClassName: 'bg-surface',
    },
    {
      value: 'dark',
      label: 'Escuro',
      dotClassName: 'border-neutral-300 bg-neutral-100',
      centerClassName: 'bg-zinc-900',
    },
    {
      value: 'sepia',
      label: 'Sepia',
      dotClassName: 'border-stone-300 bg-stone-600',
      centerClassName: 'bg-surface',
    },
    {
      value: 'oled',
      label: 'OLED',
      dotClassName: 'border-neutral-300 bg-neutral-50',
      centerClassName: 'bg-zinc-900',
    },
  ]

  return (
    <div>
      <div className="mb-2 text-xs font-medium">Tema</div>
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(next) => next && onChange(next as ReaderTheme)}
        className="grid grid-cols-4 gap-2"
      >
        {themes.map((theme) => (
          <ToggleGroup.Item
            key={theme.value}
            value={theme.value}
            className="flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-md border border-line bg-surface px-2 py-2 text-[10px] font-medium text-muted transition hover:border-gold hover:text-ink data-[state=on]:border-gold data-[state=on]:text-gold-strong data-[state=on]:shadow-[0_0_0_1px_color-mix(in_oklch,var(--accent)_55%,transparent)]"
          >
            <span
              className={`grid h-5 w-5 place-items-center rounded-full border-2 ${theme.dotClassName}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${theme.centerClassName}`}
              />
            </span>
            {theme.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  )
}

export function ReaderDemo() {
  const [settings, setSettings] = useState<ReaderSettings>(
    defaultReaderSettings,
  )
  const preview = useMemo(() => getReaderPreviewState(settings), [settings])
  const normalized = preview.normalizedSettings

  function patch(next: Partial<ReaderSettings>) {
    setSettings((current) => ({
      ...current,
      ...next,
      spread:
        next.flow === 'continuous' ? 'single' : (next.spread ?? current.spread),
    }))
  }

  return (
    <section id="demo" className="pb-16">
      <div className="mx-auto h-px w-[min(100%-40px,1180px)] border-t border-line pt-16"></div>
      <div className="mx-auto mb-10 max-w-[720px] px-5 text-center">
        <h2 className="font-display text-[clamp(2.15rem,4vw,3rem)] font-black tracking-[-0.03em]">
          Leitura personalizada
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-[17px] leading-7 text-muted">
          Ajuste a prévia como no app: fonte, tamanho, margem, temas,
          alinhamento e modo de leitura respondem na hora.
        </p>
      </div>
      <div className="mx-auto grid w-[min(100%-32px,1240px)] grid-cols-1 items-start gap-7 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-stretch xl:grid-cols-[450px_minmax(0,1fr)]">
        <Panel
          title="Aparência, layout e navegação"
          icon={<Type size={17} />}
          onReset={() => setSettings(defaultReaderSettings)}
        >
          <div>
            <div className="mb-2 text-xs font-medium">Fonte</div>
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
                        key={font.value}
                        value={font.value}
                        className="cursor-pointer px-3 py-2 text-sm outline-none hover:bg-gold-soft data-[highlighted]:bg-gold-soft"
                      >
                        <Select.ItemText>{font.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <ThemeField
            value={settings.theme}
            onChange={(theme) => patch({ theme })}
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
            label="Espaçamento de linha"
            value={settings.lineHeight}
            min={1.25}
            max={1.95}
            step={0.05}
            suffix=""
            onChange={(lineHeight) => patch({ lineHeight })}
          />
          <RangeField
            label="Espaçamento de parágrafo"
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
                {
                  value: 'left',
                  label: 'Esquerda',
                  icon: <AlignLeft size={14} />,
                },
                {
                  value: 'justify',
                  label: 'Justificado',
                  icon: <AlignJustify size={14} />,
                },
              ]}
            />
          </div>
          <ToggleField<ReaderFlow>
            label="Modo de leitura"
            value={settings.flow}
            onChange={(flow) => patch({ flow })}
            options={[
              {
                value: 'paginated',
                label: 'Paginado',
                icon: <BookOpen size={14} />,
              },
              {
                value: 'continuous',
                label: 'Contínuo',
                icon: <ScrollText size={14} />,
              },
            ]}
          />
          <ToggleField<ReaderSpread>
            label="Modo"
            value={normalized.spread}
            onChange={(spread) => patch({ spread })}
            options={[
              { value: 'single', label: 'Uma', icon: <Square size={14} /> },
              {
                value: 'double',
                label: 'Duas',
                icon: <Columns2 size={14} />,
                disabled: normalized.flow === 'continuous',
              },
            ]}
          />
        </Panel>

        <motion.article
          className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-line shadow-[0_34px_90px_color-mix(in_oklch,var(--accent)_18%,transparent),0_26px_70px_rgb(55_38_18_/_14%)]"
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
                '--reader-family': preview.readerStyle.fontFamily,
              } as CSSProperties
            }
          >
            <div
              className="reader-pages"
              data-flow={normalized.flow}
              data-spread={normalized.spread}
              style={{ padding: 'var(--reader-margin)' }}
            >
              <div className="reader-copy">
                {readerText.map((paragraph) => (
                  <p key={paragraph.title ?? paragraph.body}>
                    {paragraph.title ? (
                      <strong>{paragraph.title}</strong>
                    ) : null}
                    {paragraph.title ? ' ' : null}
                    {paragraph.body}
                  </p>
                ))}
              </div>
            </div>
          </div>
          {/* FOOTER LEITOR */}
          <div
            className="reader-footer border-t border-line px-6 py-6 text-xs"
            style={
              {
                backgroundColor: String(preview.readerStyle.backgroundColor),
                color: String(preview.readerStyle.color),
                fontFamily: preview.readerStyle.fontFamily,
              } as CSSProperties
            }
          >
            <div className="mb-2 grid grid-cols-3 gap-3">
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} />
                <span className="font-medium">Capítulo:</span> 1 / 10
              </span>
              <span className="text-center">
                <span className="font-medium">Página:</span> 10 / 50
              </span>
              <span className="text-right">
                <span className="font-medium">Progresso:</span> 20% do livro
              </span>
            </div>
            <div className="bg-ink/80 relative mt-6 h-[6px] rounded-full">
              <div className="relative h-full w-full rounded-full bg-zinc-400/25" />
              <div className="absolute top-0 h-full w-[20%] rounded-full bg-gold" />
              <div className="absolute left-[20%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-gold shadow" />
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  )
}
