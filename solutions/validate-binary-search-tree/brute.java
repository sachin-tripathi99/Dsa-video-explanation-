class Solution {
    private void inorder(TreeNode n, List<Integer> out) {
        if (n == null) return;
        inorder(n.left, out);
        out.add(n.val);
        inorder(n.right, out);
    }

    public boolean isValidBST(TreeNode root) {
        List<Integer> vals = new ArrayList<>();
        inorder(root, vals);
        for (int i = 1; i < vals.size(); i++) if (vals.get(i) <= vals.get(i - 1)) return false;
        return true;
    }
}
