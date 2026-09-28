from bisect import bisect_right

class SnapshotArray:
    def __init__(self, length: int):
        self.snaps = [[-1] for _ in range(length)]   # per index: snap ids (sentinel −1)
        self.vals = [[0] for _ in range(length)]     # matching values
        self.snap_id = 0

    def set(self, index: int, val: int) -> None:
        if self.snaps[index][-1] == self.snap_id:
            self.vals[index][-1] = val          # same snapshot: overwrite
        else:
            self.snaps[index].append(self.snap_id)
            self.vals[index].append(val)

    def snap(self) -> int:
        self.snap_id += 1
        return self.snap_id - 1

    def get(self, index: int, snap_id: int) -> int:
        i = bisect_right(self.snaps[index], snap_id) - 1   # last entry with snap ≤ snap_id
        return self.vals[index][i]
