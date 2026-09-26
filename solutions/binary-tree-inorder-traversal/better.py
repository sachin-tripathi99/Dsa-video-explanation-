class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        out, st, cur = [], [], root
        while cur or st:
            while cur:
                st.append(cur)                  # go all the way left
                cur = cur.left
            cur = st.pop()
            out.append(cur.val)                 # left side done: visit
            cur = cur.right
        return out
