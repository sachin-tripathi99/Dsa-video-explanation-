class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        view = []

        def dfs(n, depth):
            if not n:
                return
            if depth == len(view):
                view.append(n.val)              # first node at this depth
            dfs(n.right, depth + 1)             # right first
            dfs(n.left, depth + 1)

        dfs(root, 0)
        return view
