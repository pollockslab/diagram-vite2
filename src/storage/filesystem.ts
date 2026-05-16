
async function testFileSystem(): Promise<void> {
  try {
    // 1. 디렉토리 핸들 얻기 (사용자 승인 필요)
    const dirHandle: FileSystemDirectoryHandle = await window.showDirectoryPicker();

    // 2. 비동기 반복자로 폴더 내용 스캔
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        const fileEntry = entry as FileSystemFileHandle;
        console.log(`📄 파일: ${fileEntry.name}`);
      } else {
        const dirEntry = entry as FileSystemDirectoryHandle;
        console.log(`📁 폴더: ${dirEntry.name}`);
      }
    }
  } catch (err) {
    console.error("사용자가 취소했거나 오류 발생:", err);
  }
}