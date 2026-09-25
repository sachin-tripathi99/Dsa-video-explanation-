class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        TreeNode* n = root;
        while (n) {
            if (p->val < n->val && q->val < n->val) n = n->left;          // both on the left
            else if (p->val > n->val && q->val > n->val) n = n->right;    // both on the right
            else return n;                                                // they split here
        }
        return nullptr;
    }
};
