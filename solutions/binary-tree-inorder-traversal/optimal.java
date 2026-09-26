class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left == null) { out.add(cur.val); cur = cur.right; continue; }
            TreeNode pre = cur.left;
            while (pre.right != null && pre.right != cur) pre = pre.right;   // in-order predecessor
            if (pre.right == null) {
                pre.right = cur;                            // thread back to cur
                cur = cur.left;
            } else {
                pre.right = null;                           // left subtree finished
                out.add(cur.val);                           // in-order: visit on the way back
                cur = cur.right;
            }
        }
        return out;
    }
}
