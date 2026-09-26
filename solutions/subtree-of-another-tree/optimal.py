class Solution:
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        def ser(n, out):                        # preorder with null markers
            if not n:
                out.append(",#")
                return
            out.append(f",{n.val}")
            ser(n.left, out)
            ser(n.right, out)

        a, b = [], []
        ser(root, a)
        ser(subRoot, b)
        text, pat = "".join(a), "".join(b)
        fail, k = [0] * len(pat), 0             # KMP failure function
        for i in range(1, len(pat)):
            while k and pat[i] != pat[k]:
                k = fail[k - 1]
            if pat[i] == pat[k]:
                k += 1
            fail[i] = k
        k = 0
        for ch in text:
            while k and ch != pat[k]:
                k = fail[k - 1]
            if ch == pat[k]:
                k += 1
            if k == len(pat):
                return True
        return False
