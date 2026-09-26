class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left == null) { out.add(cur.val); cur = cur.right; continue; }
            TreeNode pre = cur.left;
            while (pre.right != null && pre.right != cur) pre = pre.right;   // rightmost of left subtree
            if (pre.right == null) {
                pre.right = cur;                            // thread back to cur
                out.add(cur.val);                           // pre-order: visit on the way down
                cur = cur.left;
            } else {
                pre.right = null;                           // remove the thread
                cur = cur.right;
            }
        }
        return out;
    }
}
