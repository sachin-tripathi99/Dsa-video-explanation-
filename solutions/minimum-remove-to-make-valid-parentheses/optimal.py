class Solution:
    def minRemoveToMakeValid(self, s: str) -> str:
        delete = set()
        open_idx = []                           # indices of unmatched "("
        for i, c in enumerate(s):
            if c == "(":
                open_idx.append(i)
            elif c == ")":
                if open_idx:
                    open_idx.pop()
                else:
                    delete.add(i)               # no partner
        delete.update(open_idx)                 # never closed
        return "".join(c for i, c in enumerate(s) if i not in delete)
