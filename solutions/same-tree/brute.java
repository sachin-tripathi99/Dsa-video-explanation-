class Solution {
    private void ser(TreeNode n, StringBuilder sb) {
        if (n == null) { sb.append("#,"); return; }
        sb.append(n.val).append(',');
        ser(n.left, sb);
        ser(n.right, sb);
    }

    public boolean isSameTree(TreeNode p, TreeNode q) {
        StringBuilder a = new StringBuilder(), b = new StringBuilder();
        ser(p, a);
        ser(q, b);
        return a.toString().equals(b.toString());
    }
}
