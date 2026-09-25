class Solution:
    def findJudge(self, n: int, trust: List[List[int]]) -> int:
        for p in range(1, n + 1):
            trusts_someone = any(a == p for a, _ in trust)
            trusted_by = sum(1 for _, b in trust if b == p)
            if not trusts_someone and trusted_by == n - 1:
                return p
        return -1
