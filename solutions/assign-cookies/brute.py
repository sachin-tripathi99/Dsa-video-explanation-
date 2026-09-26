class Solution:
    def findContentChildren(self, g: List[int], s: List[int]) -> int:
        used = [False] * len(s)
        content = 0
        for greed in sorted(g):
            best = -1
            for j, size in enumerate(s):        # smallest unused cookie that fits
                if not used[j] and size >= greed and (best == -1 or size < s[best]):
                    best = j
            if best != -1:
                used[best] = True
                content += 1
        return content
