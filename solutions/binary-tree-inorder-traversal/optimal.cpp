class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> out;
        TreeNode* cur = root;
        while (cur) {
            if (!cur->left) { out.push_back(cur->val); cur = cur->right; continue; }
            TreeNode* pre = cur->left;
            while (pre->right && pre->right != cur) pre = pre->right;   // in-order predecessor
            if (!pre->right) {
                pre->right = cur;                           // thread back to cur
                cur = cur->left;
            } else {
                pre->right = nullptr;                       // left subtree finished
                out.push_back(cur->val);                    // in-order: visit on the way back
                cur = cur->right;
            }
        }
        return out;
    }
};
