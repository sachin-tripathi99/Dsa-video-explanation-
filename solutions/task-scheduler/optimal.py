from collections import Counter

class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        cnt = Counter(tasks).values()
        max_f = max(cnt)
        cnt_max = sum(1 for c in cnt if c == max_f)
        return max(len(tasks), (max_f - 1) * (n + 1) + cnt_max)
