class Solution:
    def carPooling(self, trips: List[List[int]], capacity: int) -> bool:
        last = max(t for _, _, t in trips)
        for x in range(last + 1):
            if sum(p for p, f, t in trips if f <= x < t) > capacity:
                return False
        return True
