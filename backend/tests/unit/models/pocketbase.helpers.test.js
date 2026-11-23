import { jest } from "@jest/globals";
import {
  mapearCampoArquivo,
  primeiraUrlArquivo,
} from "../../../src/api/common/models/pocketbase.helpers.js";

describe("mapearCampoArquivo", () => {
  const pb = {
    files: {
      getURL: jest.fn((record, filename) => `/files/${record.id}/${filename}`),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the stored filename and PocketBase URL for a file", () => {
    expect(
      mapearCampoArquivo(
        pb,
        { id: "book-1", capa_frente: "cover.png" },
        "capa_frente",
      ),
    ).toEqual({
      capa_frenteNome: "cover.png",
      capa_frenteUrl: "/files/book-1/cover.png",
    });
  });

  it("preserves all files when the PocketBase field is multi-select", () => {
    expect(
      mapearCampoArquivo(
        pb,
        { id: "book-1", capa_frente: ["cover-1.png", "cover-2.png"] },
        "capa_frente",
      ),
    ).toEqual({
      capa_frenteNome: ["cover-1.png", "cover-2.png"],
      capa_frenteUrl: [
        "/files/book-1/cover-1.png",
        "/files/book-1/cover-2.png",
      ],
    });
  });

  it("returns null metadata without requesting a URL when no file exists", () => {
    expect(mapearCampoArquivo(pb, { id: "book-1" }, "manuscrito")).toEqual({
      manuscritoNome: null,
      manuscritoUrl: null,
    });
    expect(pb.files.getURL).not.toHaveBeenCalled();
  });

  it("returns the first URL for single-file consumers", () => {
    expect(
      primeiraUrlArquivo(["/files/1/first.pdf", "/files/1/second.pdf"]),
    ).toBe("/files/1/first.pdf");
    expect(primeiraUrlArquivo(null)).toBeNull();
  });
});
