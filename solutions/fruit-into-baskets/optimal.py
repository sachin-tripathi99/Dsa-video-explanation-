class Solution:
    def totalFruit(self, fruits: List[int]) -> int:
        count = Counter()
        l = best = 0
        for r, f in enumerate(fruits):
            count[f] += 1
            while len(count) > 2:               # a third type: shrink
                count[fruits[l]] -= 1
                if count[fruits[l]] == 0:
                    del count[fruits[l]]
                l += 1
            best = max(best, r - l + 1)
        return best
