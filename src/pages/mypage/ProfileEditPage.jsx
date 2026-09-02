import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import Avatar from "../../components/common/Avatar";
import Button from "../../components/common/Button";
import EditEmailModal from "./modals/EditEmailModal";
import EditNameModal from "./modals/EditNameModal";
import EditPasswordModal from "./modals/EditPasswordModal";
import EditPhoneModal from "./modals/EditPhoneModal";
import EditProfileImageModal from "./modals/EditProfileImageModal";
import WithdrawModal from "./modals/WithdrawModal";
import {
  AvatarEditButton,
  AvatarEditIcon,
  AvatarWrap,
  CardBanner,
  CardWrap,
  FieldBlock,
  FieldEditLink,
  FieldGrid,
  FieldLabel,
  FieldValue,
  FieldValueRow,
  ProfileEmail,
  ProfileName,
  ProfileRow,
  ProfileText,
  SectionDescription,
  SectionDivider,
  SectionTitle,
} from "./ProfileEditPage.styled";

/**
 * 마이페이지 — "개인정보 관리" 탭. path: /mypage (index route)
 * 회원 정보는 상위 셸(MyPage)이 useMember()로 한 번 불러온 걸 Outlet context로 받는다.
 * 아이디/가입일은 서버에 수정 API가 없어 "수정" 링크가 없다.
 */
function ProfileEditPage() {
  const { member, refetch } = useOutletContext();
  const [openModal, setOpenModal] = useState(null); // null | 'name'|'email'|'phone'|'password'|'image'|'withdraw'

  const joinDate = member.createDate
    ? member.createDate.slice(0, 10).replaceAll("-", ".")
    : "";

  return (
    <CardWrap>
      <CardBanner>
        <ProfileRow>
          <AvatarWrap>
            <Avatar name={member.memberName} src={member.memberImgPath} size="lg" />
            <AvatarEditButton
              type="button"
              aria-label="프로필 사진 변경"
              onClick={() => setOpenModal("image")}
            >
              <AvatarEditIcon aria-hidden="true">✏️</AvatarEditIcon>
            </AvatarEditButton>
          </AvatarWrap>
          <ProfileText>
            <ProfileName>{member.memberName}</ProfileName>
            <ProfileEmail>{member.email}</ProfileEmail>
          </ProfileText>
        </ProfileRow>

        <Button variant="danger" size="sm" onClick={() => setOpenModal("withdraw")}>
          회원탈퇴
        </Button>
      </CardBanner>

      <SectionDivider />
      <SectionTitle>기본 회원 정보</SectionTitle>
      <SectionDescription>
        알러지 아웃의 개인 맞춤형 서비스를 위한 회원 프로필 상세 정보입니다.
      </SectionDescription>

      <FieldGrid>
        <FieldBlock>
          <FieldLabel>이름</FieldLabel>
          <FieldValueRow>
            <FieldValue>{member.memberName}</FieldValue>
            <FieldEditLink type="button" onClick={() => setOpenModal("name")}>
              수정
            </FieldEditLink>
          </FieldValueRow>
        </FieldBlock>

        <FieldBlock>
          <FieldLabel>아이디</FieldLabel>
          <FieldValueRow>
            <FieldValue>{member.memberId}</FieldValue>
          </FieldValueRow>
        </FieldBlock>

        <FieldBlock>
          <FieldLabel>이메일 주소</FieldLabel>
          <FieldValueRow>
            <FieldValue>{member.email}</FieldValue>
            <FieldEditLink type="button" onClick={() => setOpenModal("email")}>
              수정
            </FieldEditLink>
          </FieldValueRow>
        </FieldBlock>

        <FieldBlock>
          <FieldLabel>연락처</FieldLabel>
          <FieldValueRow>
            <FieldValue>{member.phone}</FieldValue>
            <FieldEditLink type="button" onClick={() => setOpenModal("phone")}>
              수정
            </FieldEditLink>
          </FieldValueRow>
        </FieldBlock>

        <FieldBlock>
          <FieldLabel>가입일</FieldLabel>
          <FieldValueRow>
            <FieldValue>{joinDate}</FieldValue>
          </FieldValueRow>
        </FieldBlock>

        <FieldBlock>
          <FieldLabel>비밀번호</FieldLabel>
          <FieldValueRow>
            <FieldValue>••••••••</FieldValue>
            <FieldEditLink type="button" onClick={() => setOpenModal("password")}>
              수정
            </FieldEditLink>
          </FieldValueRow>
        </FieldBlock>
      </FieldGrid>

      <EditNameModal
        isOpen={openModal === "name"}
        onClose={() => setOpenModal(null)}
        currentName={member.memberName}
        onSuccess={refetch}
      />
      <EditEmailModal
        isOpen={openModal === "email"}
        onClose={() => setOpenModal(null)}
        currentEmail={member.email}
        onSuccess={refetch}
      />
      <EditPhoneModal
        isOpen={openModal === "phone"}
        onClose={() => setOpenModal(null)}
        currentPhone={member.phone}
        onSuccess={refetch}
      />
      <EditPasswordModal
        isOpen={openModal === "password"}
        onClose={() => setOpenModal(null)}
        onSuccess={refetch}
      />
      <EditProfileImageModal
        isOpen={openModal === "image"}
        onClose={() => setOpenModal(null)}
        currentImgPath={member.memberImgPath}
        memberName={member.memberName}
        onSuccess={refetch}
      />
      <WithdrawModal
        isOpen={openModal === "withdraw"}
        onClose={() => setOpenModal(null)}
        onSuccess={() => {
          // TODO(T-5 연동): tokenStorage.clearAccessToken() 후 /login 이동.
          setOpenModal(null);
        }}
      />
    </CardWrap>
  );
}

export default ProfileEditPage;
