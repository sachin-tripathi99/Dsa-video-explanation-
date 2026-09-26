class Solution {
    private final Map<Integer, Integer> pos = new HashMap<>();
    private int[] pre;
    private int i = 0;                                      // next root in preorder

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        pre = preorder;
        for (int k = 0; k < inorder.length; k++) pos.put(inorder[k], k);
        return build(0, inorder.length - 1);
    }

    private TreeNode build(int lo, int hi) {                // inorder range [lo, hi]
        if (lo > hi) return null;
        TreeNode root = new TreeNode(pre[i++]);
        int m = pos.get(root.val);
        root.left = build(lo, m - 1);
        root.right = build(m + 1, hi);
        return root;
    }
}
