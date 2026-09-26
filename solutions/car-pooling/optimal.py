class Solution:
    def carPooling(self, trips: List[List[int]], capacity: int) -> bool:
        d = [0] * 1001
        for p, f, t in trips:
            d[f] += p                           # board at from
            d[t] -= p                           # leave at to
        riders = 0
        for x in d:
            riders += x
            if riders > capacity:
                return False
        return True
