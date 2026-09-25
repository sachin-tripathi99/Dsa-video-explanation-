class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        a = list(stones)
        while len(a) > 1:
            a.sort()
            y, x = a.pop(), a.pop()
            if y != x:
                a.append(y - x)
        return a[0] if a else 0
