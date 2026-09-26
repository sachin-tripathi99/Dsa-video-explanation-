class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        out, start, n = [], 0, len(s)
        while start < n:
            end, i = start, start
            while i <= end:                     # every char inside the part
                j = s.rfind(s[i])               # scans the string
                end = max(end, j)
                i += 1
            out.append(end - start + 1)
            start = end + 1
        return out
