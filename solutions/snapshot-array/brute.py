class SnapshotArray:
    def __init__(self, length: int):
        self.cur = [0] * length
        self.copies = []

    def set(self, index: int, val: int) -> None:
        self.cur[index] = val

    def snap(self) -> int:
        self.copies.append(self.cur[:])         # O(n) copy every time
        return len(self.copies) - 1

    def get(self, index: int, snap_id: int) -> int:
        return self.copies[snap_id][index]
