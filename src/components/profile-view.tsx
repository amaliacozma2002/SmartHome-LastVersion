"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Shield,
  TabletsIcon as Devices,
  Save,
  Edit,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import type { View, UserType } from "@/types";
import { getCurrentTime } from "@/lib/utils";
import { authAPI } from "@/api";

interface ProfileViewProps {
  user: UserType;
  updateProfile: (updates: Partial<UserType>) => void;
  setCurrentView: (view: View) => void;
  handleLogout: () => void;
}

export function ProfileView({
  user,
  updateProfile,
  setCurrentView,
  handleLogout,
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Provide default user values if user is undefined
  const safeUser = user || {
    firstName: "User",
    lastName: "",
    email: "user@example.com",
    subscription: "Free",
    maxDevices: 5,
    subscriptionExpiry: new Date().toISOString().split("T")[0],
    username: "User Name",
  };

  // Additional safety for firstName and lastName
  const separatedName = safeUser.username.split(" ");
  const firstName = separatedName[0];
  const lastName = separatedName[1];
  const fullName = `${firstName} ${lastName}`.trim();
  const userInitial = firstName.charAt(0).toUpperCase();

  // Use lastLogin as join date or fallback to a default date
  const memberSince = safeUser.lastLogin || new Date().toISOString();

  const [formData, setFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    email: safeUser.email,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [deleteAccountEmail, setDeleteAccountEmail] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleSave = () => {
    updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: firstName,
      lastName: lastName,
      email: safeUser.email,
    });
    setIsEditing(false);
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8)
      errors.push("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(password))
      errors.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password))
      errors.push("Password must contain at least one lowercase letter");
    if (!/\d/.test(password))
      errors.push("Password must contain at least one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("Password must contain at least one special character");
    return errors;
  };
  const handleChangePassword = async () => {
    setPasswordErrors([]);

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordErrors(["All password fields are required"]);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors(["New passwords do not match"]);
      return;
    }

    const validationErrors = validatePassword(passwordData.newPassword);
    if (validationErrors.length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }

    setIsChangingPassword(true);

    try {
      // Make actual API call to change password
      await authAPI.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowChangePassword(false);
      alert("Password changed successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to change password. Please try again.";
      setPasswordErrors([errorMessage]);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteAccountEmail !== safeUser.email) {
      alert("Email confirmation does not match your account email");
      return;
    }

    setIsDeletingAccount(true);

    try {
      // Make actual API call to delete account
      await authAPI.deleteAccount();

      alert("Account deleted successfully!");

      // Properly logout the user and then redirect
      handleLogout();
      setCurrentView("welcome");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete account. Please try again.";
      alert(errorMessage);
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };
  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case "Pro":
        return "bg-purple-500";
      case "Premium":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-700 pb-20 text-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-black/10 p-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("settings")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500">
              <User className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
        </div>
        <div className="text-base font-medium">{getCurrentTime()}</div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardContent className="p-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white text-2xl font-bold mx-auto mb-4">
              {userInitial}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{fullName}</h2>
            <p className="text-purple-200 mb-3">{safeUser.email}</p>
            <div className="flex items-center justify-center gap-2">
              <Badge
                className={`${getSubscriptionColor(
                  safeUser.subscription
                )} text-white`}
              >
                {safeUser.subscription} Plan
              </Badge>
              <Badge className="bg-white/20 text-white">
                Member since {formatDate(memberSince)}
              </Badge>
            </div>
          </CardContent>
        </Card>
        {/* Account Information */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Account Information
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(!isEditing)}
                className="text-purple-200 hover:text-white hover:bg-white/10"
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-purple-200 flex items-center gap-2">
                <User className="h-4 w-4" />
                First Name
              </Label>
              {isEditing ? (
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
                />
              ) : (
                <div className="text-white font-medium mt-1">{firstName}</div>
              )}
            </div>

            <div>
              <Label className="text-purple-200 flex items-center gap-2">
                <User className="h-4 w-4" />
                Last Name
              </Label>
              {isEditing ? (
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
                />
              ) : (
                <div className="text-white font-medium mt-1">{lastName}</div>
              )}
            </div>
            <div>
              <Label className="text-purple-200 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
                />
              ) : (
                <div className="text-white font-medium mt-1">
                  {safeUser.email}
                </div>
              )}
            </div>

            <div>
              <Label className="text-purple-200 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member Since
              </Label>
              <div className="text-white font-medium mt-1">
                {formatDate(memberSince)}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 border-white/20"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Subscription Details */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Current Plan</span>
              <Badge
                className={`${getSubscriptionColor(
                  safeUser.subscription
                )} text-white`}
              >
                {safeUser.subscription}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-purple-200">Device Limit</span>
              <span className="text-white font-medium">
                {safeUser.maxDevices} devices
              </span>
            </div>

            {safeUser.subscriptionExpiry && (
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Expires</span>
                <span className="text-white font-medium">
                  {formatDate(safeUser.subscriptionExpiry)}
                </span>
              </div>
            )}

            <Button
              onClick={() => setCurrentView("subscription")}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              Manage Subscription
            </Button>
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Devices className="h-5 w-5" />
              Account Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-sm text-purple-200">Devices Connected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-sm text-purple-200">Rooms Created</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-sm text-purple-200">Scenes Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-sm text-purple-200">Automations</div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Security Settings */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => setShowChangePassword(!showChangePassword)}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>

            {/* Change Password Form */}
            {showChangePassword && (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <Label className="text-purple-200">Current Password</Label>
                    <div className="relative">
                      <Input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="bg-white/10 text-white border-white/20 placeholder:text-white/50 pr-10"
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-purple-200">New Password</Label>
                    <div className="relative">
                      <Input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="bg-white/10 text-white border-white/20 placeholder:text-white/50 pr-10"
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-purple-200">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="bg-white/10 text-white border-white/20 placeholder:text-white/50 pr-10"
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {passwordErrors.length > 0 && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded p-3">
                      {passwordErrors.map((error, index) => (
                        <p key={index} className="text-red-300 text-sm">
                          {error}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      {isChangingPassword ? "Changing..." : "Change Password"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setPasswordErrors([]);
                      }}
                      className="flex-1 border-white/20"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            <Button
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>

            {/* Delete Account Confirmation */}
            {showDeleteConfirm && (
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-semibold">
                      Warning: This action cannot be undone!
                    </span>
                  </div>

                  <p className="text-red-300 text-sm">
                    Deleting your account will permanently remove all your data,
                    including devices, rooms, scenes, and automations. This
                    action cannot be reversed.
                  </p>

                  <div>
                    <Label className="text-red-300">
                      Type your email to confirm deletion:
                    </Label>
                    <Input
                      type="email"
                      value={deleteAccountEmail}
                      onChange={(e) => setDeleteAccountEmail(e.target.value)}
                      className="bg-red-500/10 text-white border-red-500/30 placeholder:text-red-400/50"
                      placeholder={safeUser.email}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={
                        isDeletingAccount ||
                        deleteAccountEmail !== safeUser.email
                      }
                      className="flex-1 bg-red-500 hover:bg-red-600"
                    >
                      {isDeletingAccount ? "Deleting..." : "Delete My Account"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteAccountEmail("");
                      }}
                      className="flex-1 border-white/20"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
