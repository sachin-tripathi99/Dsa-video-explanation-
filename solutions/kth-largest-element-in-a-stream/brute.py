class KthLargest:
    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.all = list(nums)

    def add(self, val: int) -> int:
        self.all.append(val)
        self.all.sort()
        return self.all[-self.k]
