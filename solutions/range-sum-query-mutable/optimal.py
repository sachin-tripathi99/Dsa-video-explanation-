class NumArray:
    def __init__(self, nums: List[int]):
        self.n = len(nums)
        self.sum = [0] * (4 * self.n)           # segment tree, node k has kids 2k, 2k+1
        self._build(1, 0, self.n - 1, nums)

    def _build(self, k, lo, hi, a):
        if lo == hi:
            self.sum[k] = a[lo]
            return
        mid = (lo + hi) // 2
        self._build(2 * k, lo, mid, a)
        self._build(2 * k + 1, mid + 1, hi, a)
        self.sum[k] = self.sum[2 * k] + self.sum[2 * k + 1]

    def update(self, index: int, val: int) -> None:
        def go(k, lo, hi):
            if lo == hi:
                self.sum[k] = val
                return
            mid = (lo + hi) // 2
            if index <= mid:
                go(2 * k, lo, mid)
            else:
                go(2 * k + 1, mid + 1, hi)
            self.sum[k] = self.sum[2 * k] + self.sum[2 * k + 1]   # fix on the way back up
        go(1, 0, self.n - 1)

    def sumRange(self, left: int, right: int) -> int:
        def query(k, lo, hi):
            if right < lo or hi < left:         # outside
                return 0
            if left <= lo and hi <= right:      # inside
                return self.sum[k]
            mid = (lo + hi) // 2
            return query(2 * k, lo, mid) + query(2 * k + 1, mid + 1, hi)
        return query(1, 0, self.n - 1)
