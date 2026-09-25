class Solution {
    void inorder(TreeNode* n, vector<int>& out) {
        if (!n) return;
        inorder(n->left, out);
        out.push_back(n->val);
        inorder(n->right, out);
    }
public:
    bool isValidBST(TreeNode* root) {
        vector<int> vals;
        inorder(root, vals);
        for (size_t i = 1; i < vals.size(); i++) if (vals[i] <= vals[i - 1]) return false;
        return true;
    }
};
