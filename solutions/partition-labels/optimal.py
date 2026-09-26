class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        last = {c: i for i, c in enumerate(s)}
        out, start, end = [], 0, 0
        for i, c in enumerate(s):
            end = max(end, last[c])             # must reach this letter's last copy
            if i == end:                        # nothing inside appears later
                out.append(end - start + 1)
                start = i + 1
        return out
