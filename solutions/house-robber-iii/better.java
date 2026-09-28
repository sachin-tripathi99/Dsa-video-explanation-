class Solution {
    private final Map<TreeNode, Integer> memo = new HashMap<>();

    public int rob(TreeNode root) {
        if (root == null) return 0;
        Integer cached = memo.get(root);
        if (cached != null) return cached;                  // solved before
        int take = root.val;
        if (root.left != null) take += rob(root.left.left) + rob(root.left.right);
        if (root.right != null) take += rob(root.right.left) + rob(root.right.right);
        int res = Math.max(take, rob(root.left) + rob(root.right));
        memo.put(root, res);
        return res;
    }
}
