class Solution {
    TreeNode* mirrorCopy(TreeNode* n) {
        if (!n) return nullptr;
        TreeNode* c = new TreeNode(n->val);
        c->left = mirrorCopy(n->right);
        c->right = mirrorCopy(n->left);
        return c;
    }
    bool same(TreeNode* a, TreeNode* b) {
        if (!a || !b) return a == b;
        return a->val == b->val && same(a->left, b->left) && same(a->right, b->right);
    }
public:
    bool isSymmetric(TreeNode* root) {
        return same(root, mirrorCopy(root));
    }
};
