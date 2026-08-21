/**
 * Direção de qualidade: os testes percorrem ferramentas como um estudante, validando orientação útil sem login.
 */
import { expect, test } from "@playwright/test";

test.describe("Ferramentas do Extensão Fácil", () => {
  test("gera cinco ideias de extensão a partir do curso selecionado", async ({ page }) => {
    await page.goto("/ferramentas/gerador-de-ideias/");

    await page.locator("#course").selectOption("pedagogia");
    await page.getByRole("button", { name: "Gerar sugestões" }).click();

    await expect(page.getByText("Propostas para explorar")).toBeVisible();
    await expect(page.locator(".proposal-card")).toHaveCount(5);
    await expect(page.getByText("Problema identificado")).toBeVisible();
    await expect(page.getByText("ODS relacionado")).toBeVisible();
  });

  test("recomenda um ODS principal e relações complementares", async ({ page }) => {
    await page.goto("/ferramentas/seletor-de-ods/");

    await page.getByLabel("Falta de informação sobre prevenção e saúde").check();
    await page.getByLabel("Empreendedores e pequenos negócios").check();
    await page.getByLabel("Ação de prevenção ou informação em saúde").check();
    await page.getByLabel("Unidade ou serviço de saúde").check();
    await page.getByRole("button", { name: "Encontrar ODS compatível" }).click();

    await expect(page.getByText("Sua relação principal")).toBeVisible();
    await expect(page.locator(".main-ods-result")).toContainText("ODS 3");
    await expect(page.getByText("Também podem se relacionar")).toBeVisible();
  });

  test("salva o progresso do checklist no navegador", async ({ page }) => {
    await page.goto("/ferramentas/checklist-relatorio/");
    await page.evaluate(() => localStorage.removeItem("extensao-facil:report-checklist"));
    await page.reload();

    await expect(page.getByText("0 de 11 itens organizados")).toBeVisible();
    const firstItem = page.getByLabel("Dados da instituição e do local confirmados");
    await firstItem.check();
    await expect(page.getByText("1 de 11 itens organizados")).toBeVisible();

    await page.reload();
    await expect(page.getByText("1 de 11 itens organizados")).toBeVisible();
    await expect(page.getByLabel("Dados da instituição e do local confirmados")).toBeChecked();
  });
});
