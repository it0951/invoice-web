"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  User,
  Settings,
  LogOut,
  Zap,
  Code2,
  Layers,
  Package,
  Palette,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// 폼 스키마 (zod)
const signupSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상 입력해주세요"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  password: z.string().min(8, "비밀번호는 8자 이상 입력해주세요"),
  role: z.enum(["developer", "designer", "manager"] as const, {
    error: "역할을 선택해주세요",
  }),
  terms: z.boolean().refine((v) => v === true, "이용약관에 동의해주세요"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

// 샘플 테이블 데이터
const tableData = [
  {
    id: 1,
    name: "김철수",
    email: "kim@example.com",
    role: "개발자",
    status: "활성",
  },
  {
    id: 2,
    name: "이영희",
    email: "lee@example.com",
    role: "디자이너",
    status: "활성",
  },
  {
    id: 3,
    name: "박민준",
    email: "park@example.com",
    role: "매니저",
    status: "비활성",
  },
  {
    id: 4,
    name: "최수연",
    email: "choi@example.com",
    role: "개발자",
    status: "활성",
  },
];

// 섹션 래퍼 컴포넌트
function Section({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const [progress, setProgress] = useState(60);
  const [switchOn, setSwitchOn] = useState(false);
  const [checked, setChecked] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    toast.success("회원가입 성공!", {
      description: `${data.name}님 환영합니다.`,
    });
    form.reset();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 space-y-16">
      {/* ── Hero ── */}
      <section className="flex flex-col items-center gap-6 text-center py-8">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Zap className="size-3" />
            v1.0.0
          </Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          모던 웹 스타터킷
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Next.js 16 · TypeScript · TailwindCSS v4 · ShadcnUI로 구성된 프로덕션
          레디 스타터킷. 다크모드, 폼 검증, 반응형 레이아웃이 기본 내장되어
          있습니다.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {/* asChild: Button 스타일을 Link에 적용 — 페이지 내 컴포넌트 섹션으로 스크롤 */}
          <Button size="lg" className="gap-2" asChild>
            <Link href="#components">
              <Code2 className="size-4" />
              시작하기
            </Link>
          </Button>
          {/* 외부 링크: Next.js 공식 문서 */}
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Package className="size-4" />
              문서 보기
            </a>
          </Button>
        </div>

        {/* Breadcrumb 예시 */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {/* asChild: BreadcrumbLink 스타일을 Next.js Link에 적용 */}
              <BreadcrumbLink asChild>
                <Link href="/">홈</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#components">컴포넌트</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {/* 현재 페이지는 BreadcrumbPage — 링크 없음 */}
              <BreadcrumbPage>쇼케이스</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>

      <Separator />

      {/* ── 기술 스택 ── */}
      <Section
        title="기술 스택"
        description="이 스타터킷을 구성하는 라이브러리"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {[
            { icon: Layers, label: "Next.js 16", color: "text-foreground" },
            { icon: Code2, label: "TypeScript", color: "text-blue-500" },
            { icon: Package, label: "ShadcnUI", color: "text-foreground" },
            { icon: Zap, label: "Zod", color: "text-amber-500" },
            { icon: CheckCircle2, label: "RHF", color: "text-emerald-500" },
          ].map(({ icon: Icon, label, color }) => (
            <Card key={label} size="sm" className="items-center text-center">
              <CardContent className="flex flex-col items-center gap-2 pt-4 pb-4">
                <Icon className={`size-6 ${color}`} />
                <span className="text-xs font-medium">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── Atoms ── */}
      <Section
        id="components"
        title="Atoms — 기본 원자 컴포넌트"
        description="독립적으로 동작하는 가장 작은 UI 요소"
      >
        <div className="space-y-8">
          {/* Button */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Button variants
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="xs">XSmall</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          <Separator />

          {/* Badge */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Badge</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          <Separator />

          {/* Avatar */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Avatar
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Avatar size="sm">
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <AvatarGroup>
                {["KS", "LY", "PM", "CS"].map((initials) => (
                  <Avatar key={initials}>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                ))}
                <AvatarGroupCount className="flex size-8 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground ring-2 ring-background">
                  +3
                </AvatarGroupCount>
              </AvatarGroup>
            </div>
          </div>

          <Separator />

          {/* Input / Textarea */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Input & Textarea
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="sample-input">이름</Label>
                <Input id="sample-input" placeholder="이름을 입력하세요" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sample-email">이메일</Label>
                <Input
                  id="sample-email"
                  type="email"
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="sample-textarea">메시지</Label>
                <Textarea
                  id="sample-textarea"
                  placeholder="내용을 입력하세요"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Switch / Checkbox / Progress / Skeleton */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Switch · Checkbox · Progress · Skeleton
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Switch
                  id="demo-switch"
                  checked={switchOn}
                  onCheckedChange={setSwitchOn}
                />
                <Label htmlFor="demo-switch">
                  알림 {switchOn ? "켜짐" : "꺼짐"}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="demo-checkbox"
                  checked={checked}
                  onCheckedChange={(v) => setChecked(v as boolean)}
                />
                <Label htmlFor="demo-checkbox">이용약관 동의</Label>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>진행률</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
                <div className="flex gap-2">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setProgress((p) => Math.max(0, p - 10))}
                  >
                    -10
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setProgress((p) => Math.min(100, p + 10))}
                  >
                    +10
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Separator />

      {/* ── Molecules ── */}
      <Section
        title="Molecules — 분자 컴포넌트"
        description="원자들의 조합으로 이루어진 기능 단위"
      >
        <div className="space-y-6">
          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>기본 카드</CardTitle>
                <CardDescription>
                  CardHeader, CardTitle, CardDescription 사용
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  카드 본문 영역입니다. 다양한 콘텐츠를 배치할 수 있습니다.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">
                  자세히 보기
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>액션 카드</CardTitle>
                <CardDescription>CardAction을 사용한 카드</CardDescription>
                <CardAction>
                  <Badge>New</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  오른쪽 상단에 액션 영역을 추가할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>통계 카드</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12,400</div>
                <p className="text-xs text-muted-foreground mt-1">
                  지난달 대비{" "}
                  <span className="text-emerald-500 font-medium">+12%</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Alert>
              <Info className="size-4" />
              <AlertTitle>안내</AlertTitle>
              <AlertDescription>
                기본 안내 메시지입니다. 사용자에게 정보를 전달합니다.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>오류 발생</AlertTitle>
              <AlertDescription>
                오류가 발생했습니다. 다시 시도해주세요.
              </AlertDescription>
            </Alert>
          </div>

          {/* Tooltip & Popover */}
          <div className="flex flex-wrap gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">툴팁 hover</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>이것이 툴팁입니다</p>
              </TooltipContent>
            </Tooltip>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">팝오버 클릭</Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">팝오버 제목</h4>
                  <p className="text-xs text-muted-foreground">
                    클릭으로 여닫는 팝오버 컴포넌트입니다.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Section>

      <Separator />

      {/* ── Form ── */}
      <Section
        id="form"
        title="Form — react-hook-form + zod"
        description="타입 안전한 폼 검증 예제"
      >
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>회원가입</CardTitle>
            <CardDescription>
              정보를 입력하고 제출하면 zod 검증이 실행됩니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* 이름 */}
              <div className="space-y-1.5">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  placeholder="홍길동"
                  aria-invalid={!!form.formState.errors.name}
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* 이메일 */}
              <div className="space-y-1.5">
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  aria-invalid={!!form.formState.errors.email}
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* 비밀번호 */}
              <div className="space-y-1.5">
                <Label htmlFor="password">비밀번호 *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="8자 이상"
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* 역할 Select */}
              <div className="space-y-1.5">
                <Label>역할 *</Label>
                <Select
                  onValueChange={(v) =>
                    form.setValue("role", v as SignupFormValues["role"])
                  }
                >
                  <SelectTrigger aria-invalid={!!form.formState.errors.role}>
                    <SelectValue placeholder="역할을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">개발자</SelectItem>
                    <SelectItem value="designer">디자이너</SelectItem>
                    <SelectItem value="manager">매니저</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.role && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.role.message}
                  </p>
                )}
              </div>

              {/* 약관 동의 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terms"
                    checked={form.watch("terms")}
                    onCheckedChange={(v) =>
                      form.setValue("terms", v as boolean)
                    }
                    aria-invalid={!!form.formState.errors.terms}
                  />
                  <Label htmlFor="terms" className="cursor-pointer">
                    이용약관에 동의합니다
                  </Label>
                </div>
                {form.formState.errors.terms && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.terms.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                가입하기
              </Button>
            </form>
          </CardContent>
        </Card>
      </Section>

      <Separator />

      {/* ── Organisms ── */}
      <Section
        id="components"
        title="Organisms — 복합 컴포넌트"
        description="복잡한 인터랙션을 담당하는 UI 섹션"
      >
        <div className="space-y-8">
          {/* Tabs */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Tabs</h3>
            <Tabs defaultValue="overview" className="max-w-lg">
              <TabsList>
                <TabsTrigger value="overview">개요</TabsTrigger>
                <TabsTrigger value="analytics">분석</TabsTrigger>
                <TabsTrigger value="settings">설정</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <Card size="sm">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      개요 탭 콘텐츠입니다.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analytics" className="mt-4">
                <Card size="sm">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      분석 탭 콘텐츠입니다.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="settings" className="mt-4">
                <Card size="sm">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      설정 탭 콘텐츠입니다.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          {/* Accordion */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Accordion
            </h3>
            <Accordion type="single" collapsible className="max-w-lg">
              <AccordionItem value="item-1">
                <AccordionTrigger>Next.js App Router란?</AccordionTrigger>
                <AccordionContent>
                  App Router는 React Server Components를 기반으로 한 새로운
                  라우팅 시스템입니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>TailwindCSS v4의 변경점은?</AccordionTrigger>
                <AccordionContent>
                  v4에서는 CSS-first 설정, 새로운 oklch 색상 시스템, 더 빠른
                  빌드 속도가 도입되었습니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  ShadcnUI radix-nova 스타일이란?
                </AccordionTrigger>
                <AccordionContent>
                  radix-nova는 ShadcnUI의 새로운 기본 스타일로, 더 세련된 디자인
                  토큰을 제공합니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Separator />

          {/* Dialog / Sheet / Dropdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Dialog · Sheet · Dropdown · Command
            </h3>
            <div className="flex flex-wrap gap-3">
              {/* Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">다이얼로그</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>다이얼로그 제목</DialogTitle>
                    <DialogDescription>
                      중요한 작업을 수행하기 전 사용자 확인을 요청하는
                      모달입니다.
                    </DialogDescription>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground">
                    다이얼로그 본문 내용이 들어가는 영역입니다.
                  </p>
                  <DialogFooter>
                    <Button variant="outline">취소</Button>
                    <Button>확인</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">사이드 시트</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>설정</SheetTitle>
                    <SheetDescription>
                      오른쪽에서 슬라이드되는 사이드 패널입니다.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>알림 설정</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>이메일 수신</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    드롭다운
                    <ChevronDown className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44">
                  <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <User className="size-4" /> 프로필
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Settings className="size-4" /> 설정
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                    <LogOut className="size-4" /> 로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Command */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    커맨드 팔레트
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-64" align="start">
                  <Command>
                    <CommandInput placeholder="명령어 검색..." />
                    <CommandList>
                      <CommandEmpty>결과가 없습니다.</CommandEmpty>
                      <CommandGroup heading="작업">
                        <CommandItem>새 파일 만들기</CommandItem>
                        <CommandItem>저장</CommandItem>
                        <CommandItem>설정 열기</CommandItem>
                      </CommandGroup>
                      <CommandGroup heading="이동">
                        <CommandItem>홈으로</CommandItem>
                        <CommandItem>컴포넌트 페이지</CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </Section>

      <Separator />

      {/* ── Feedback (Toast) ── */}
      <Section
        id="feedback"
        title="Feedback — Toast 알림"
        description="sonner 라이브러리 기반 토스트 알림"
      >
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast("기본 알림", { description: "일반 메시지입니다." })
            }
          >
            기본
          </Button>
          <Button
            variant="outline"
            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30"
            onClick={() =>
              toast.success("성공!", { description: "작업이 완료되었습니다." })
            }
          >
            <CheckCircle2 className="size-4" /> 성공
          </Button>
          <Button
            variant="outline"
            className="text-destructive border-destructive/30 hover:bg-destructive/5"
            onClick={() =>
              toast.error("오류 발생", { description: "다시 시도해주세요." })
            }
          >
            <AlertCircle className="size-4" /> 오류
          </Button>
          <Button
            variant="outline"
            className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/30"
            onClick={() =>
              toast.info("안내", { description: "참고할 정보가 있습니다." })
            }
          >
            <Info className="size-4" /> 정보
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const id = toast.loading("처리 중...");
              setTimeout(() => toast.success("완료!", { id }), 2000);
            }}
          >
            <Bell className="size-4" /> 로딩 → 완료
          </Button>
        </div>
      </Section>

      <Separator />

      {/* ── Table ── */}
      <Section title="Table — 데이터 테이블">
        <Card>
          <Table>
            <TableCaption>팀 구성원 목록</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-muted-foreground">
                    {row.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback>{row.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      {row.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={row.status === "활성" ? "default" : "outline"}
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem>수정</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Section>
    </div>
  );
}
